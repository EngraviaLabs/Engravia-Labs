import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import { AppError } from '../middleware/error.middleware';
import { createRazorpayOrder, verifyRazorpaySignature, createStripePaymentIntent, constructStripeEvent } from '../services/payment.service';
import emailService from '../services/email.service';

export const createRazorpayOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) return next(new AppError('Order not found.', 404));
    const rzpOrder = await createRazorpayOrder(order.total, order.orderNumber);
    await Order.findByIdAndUpdate(order._id, { 'paymentDetails.razorpayOrderId': rzpOrder.id });
    res.json({ success: true, razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (e) { next(e); }
};

export const verifyRazorpayPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) return next(new AppError('Payment verification failed.', 400));
    const order = await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid', orderStatus: 'confirmed',
      'paymentDetails.razorpayPaymentId': razorpayPaymentId,
      'paymentDetails.razorpaySignature': razorpaySignature,
      'paymentDetails.paidAt': new Date(),
      $push: { statusHistory: { status: 'confirmed', timestamp: new Date(), note: 'Payment received via Razorpay' } },
    }, { new: true }).populate('user', 'name email');
    if (!order) return next(new AppError('Order not found.', 404));
    const user = order.user as any;
    if (user?.email) await emailService.sendOrderConfirmation(user.email, user.name, order);
    res.json({ success: true, order });
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
