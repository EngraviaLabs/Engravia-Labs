import { Router } from 'express';
import { createRazorpayOrderHandler, verifyRazorpayPayment, createStripeIntent, stripeWebhook } from '../controllers/payment.controller';

const router = Router();
router.post('/razorpay/create', createRazorpayOrderHandler);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/stripe/create-intent', createStripeIntent);
router.post('/stripe/webhook', stripeWebhook);
export default router;
