import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import { AppError } from '../middleware/error.middleware';
import { createRazorpayOrder, verifyRazorpaySignature, createStripePaymentIntent, constructStripeEvent } from '../services/payment.service';
import emailService from '../services/email.service';

export const createRazorpayOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, amount: reqAmount, currency: reqCurrency, receipt: reqReceipt } = req.body;
    let totalAmount = reqAmount;
    let receiptId = reqReceipt || `rcpt_${Date.now()}`;
    let order: any = null;

    if (orderId) {
      order = await Order.findById(orderId);
      if (!order) return next(new AppError('Order not found.', 404));
      totalAmount = order.total;
      receiptId = order.orderNumber;
    }

    if (!totalAmount || totalAmount <= 0) {
      return next(new AppError('Valid payment amount is required.', 400));
    }

    const rzpOrder = await createRazorpayOrder(totalAmount, receiptId);
    
    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        'paymentDetails.razorpayOrderId': rzpOrder.id,
        'paymentDetails.amount': totalAmount,
      });
    }

    res.json({
      success: true,
      order_id: rzpOrder.id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency || reqCurrency || 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_T4jYhLKhRcdUW5',
    });
  } catch (e) { next(e); }
};

export const verifyRazorpayPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, razorpayOrderId, razorpay_order_id, razorpayPaymentId, razorpay_payment_id, razorpaySignature, razorpay_signature } = req.body;
    
    const rzpOrderId = razorpayOrderId || razorpay_order_id;
    const rzpPaymentId = razorpayPaymentId || razorpay_payment_id;
    const rzpSignature = razorpaySignature || razorpay_signature;

    if (!rzpOrderId || !rzpPaymentId || !rzpSignature) {
      return next(new AppError('Missing payment verification details.', 400));
    }

    const isValid = verifyRazorpaySignature(rzpOrderId, rzpPaymentId, rzpSignature);
    if (!isValid) return next(new AppError('Payment signature verification failed. Invalid HMAC SHA256 signature.', 400));

    let order = null;
    if (orderId) {
      order = await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        'paymentDetails.razorpayOrderId': rzpOrderId,
        'paymentDetails.razorpayPaymentId': rzpPaymentId,
        'paymentDetails.razorpaySignature': rzpSignature,
        'paymentDetails.paidAt': new Date(),
        $push: { statusHistory: { status: 'confirmed', timestamp: new Date(), note: 'Payment verified via Razorpay Standard Checkout' } },
      }, { new: true }).populate('user', 'name email');

      if (order && (order.user as any)?.email) {
        emailService.sendOrderConfirmation((order.user as any).email, (order.user as any).name, order).catch(e => console.warn('Order mail err:', e));
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully.',
      paymentId: rzpPaymentId,
      orderId: rzpOrderId,
      order,
    });
  } catch (e) { next(e); }
};

export const createStripeIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) return next(new AppError('Order not found.', 404));
    const intent = await createStripePaymentIntent(order.total, { orderId: order._id.toString(), orderNumber: order.orderNumber });
    await Order.findByIdAndUpdate(order._id, { 'paymentDetails.stripePaymentIntentId': intent.id });
    res.json({ success: true, clientSecret: intent.client_secret });
  } catch (e) { next(e); }
};

export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const event = constructStripeEvent(req.body, sig);
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as any;
      await Order.findOneAndUpdate(
        { 'paymentDetails.stripePaymentIntentId': intent.id },
        { paymentStatus: 'paid', orderStatus: 'confirmed', 'paymentDetails.paidAt': new Date(), $push: { statusHistory: { status: 'confirmed', timestamp: new Date(), note: 'Payment received via Stripe' } } },
      );
    } else if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as any;
      await Order.findOneAndUpdate({ 'paymentDetails.stripePaymentIntentId': intent.id }, { paymentStatus: 'failed' });
    }
    res.json({ received: true });
  } catch (e) { next(e); }
};
