import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: '2024-04-10' });

export const createRazorpayOrder = async (amount: number, receipt: string) => {
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt,
    notes: { platform: 'engravialabs.com' },
  });
};

export const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string): boolean => {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
};

export const createStripePaymentIntent = async (amount: number, metadata?: Record<string, string>) => {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'inr',
    automatic_payment_methods: { enabled: true },
    metadata: metadata || {},
  });
};

export const constructStripeEvent = (payload: Buffer, signature: string) => {
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
};

export const createRazorpayRefund = async (paymentId: string, amount: number) => {
  return razorpay.payments.refund(paymentId, { amount: Math.round(amount * 100) });
};

export const createStripeRefund = async (paymentIntentId: string, amount: number) => {
  return stripe.refunds.create({ payment_intent: paymentIntentId, amount: Math.round(amount * 100) });
};
