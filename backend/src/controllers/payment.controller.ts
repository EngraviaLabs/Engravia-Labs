import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Coupon from '../models/Coupon';
import User from '../models/User';
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
    if (!isValid) {
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'failed',
          orderStatus: 'cancelled',
          $push: { statusHistory: { status: 'cancelled', timestamp: new Date(), note: 'Payment verification failed (invalid signature)' } },
        });
      }
      return next(new AppError('Payment signature verification failed. Invalid HMAC SHA256 signature.', 400));
    }

    let order = orderId ? await Order.findById(orderId) : await Order.findOne({ 'paymentDetails.razorpayOrderId': rzpOrderId });
    if (!order) return next(new AppError('Order not found.', 404));

    // If order was already paid, return success (idempotent)
    if (order.paymentStatus === 'paid') {
      return res.json({ success: true, message: 'Payment already verified.', order });
    }

    // Mark as PAID & CONFIRMED
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentDetails = {
      ...order.paymentDetails,
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: rzpPaymentId,
      razorpaySignature: rzpSignature,
      paidAt: new Date(),
    };
    order.statusHistory.push({ status: 'confirmed', timestamp: new Date(), note: 'Payment verified via Razorpay Standard Checkout' });
    await order.save();

    // Deduct stock upon successful payment
    await Promise.all(order.items.map((item: any) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, salesCount: item.quantity } })));

    // Update coupon usage
    if (order.couponCode && order.user) {
      await Coupon.findOneAndUpdate(
        { code: order.couponCode.toUpperCase() },
        { $inc: { usedCount: 1 }, $push: { usedBy: { user: order.user, orderId: order._id } } }
      );
    }

    // Update user stats
    if (order.user) {
      await User.findByIdAndUpdate(order.user, { $inc: { totalOrders: 1, totalSpent: order.total } });
    }

    // Send confirmation email ONLY AFTER successful payment verification!
    const userDoc: any = order.user ? await User.findById(order.user) : null;
    const emailTo = userDoc?.email || order.guestEmail;
    const recipientName = userDoc?.name || order.guestName || 'Valued Customer';
    if (emailTo) {
      emailService.sendOrderConfirmation(emailTo, recipientName, order).catch(e => console.warn('Order confirmation email error:', e));
    }

    res.json({
      success: true,
      message: 'Payment verified & order confirmed successfully.',
      paymentId: rzpPaymentId,
      orderId: rzpOrderId,
      order,
    });
  } catch (e) { next(e); }
};

export const handlePaymentFailure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, reason } = req.body;
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
        order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), note: reason || 'Payment failed or modal dismissed' });
        await order.save();
      }
    }
    res.json({ success: true, message: 'Payment status updated to failed.' });
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
      const order = await Order.findOneAndUpdate(
        { 'paymentDetails.stripePaymentIntentId': intent.id, paymentStatus: { $ne: 'paid' } },
        { paymentStatus: 'paid', orderStatus: 'confirmed', 'paymentDetails.paidAt': new Date(), $push: { statusHistory: { status: 'confirmed', timestamp: new Date(), note: 'Payment received via Stripe' } } },
        { new: true }
      );
      if (order) {
        await Promise.all(order.items.map((item: any) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, salesCount: item.quantity } })));
        if (order.user) await User.findByIdAndUpdate(order.user, { $inc: { totalOrders: 1, totalSpent: order.total } });
        const userDoc: any = order.user ? await User.findById(order.user) : null;
        const emailTo = userDoc?.email || order.guestEmail;
        if (emailTo) emailService.sendOrderConfirmation(emailTo, userDoc?.name || order.guestName || 'Valued Customer', order).catch(e => console.warn(e));
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as any;
      await Order.findOneAndUpdate({ 'paymentDetails.stripePaymentIntentId': intent.id }, { paymentStatus: 'failed', orderStatus: 'cancelled' });
    }
    res.json({ received: true });
  } catch (e) { next(e); }
};
