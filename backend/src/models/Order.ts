import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus = 'placed'|'confirmed'|'processing'|'shipped'|'delivered'|'cancelled'|'refunded';
export type PaymentStatus = 'pending'|'paid'|'failed'|'refunded'|'partially_refunded';
export type PaymentMethod = 'razorpay'|'gpay'|'stripe'|'cod';

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId; guestEmail?: string; guestName?: string;
  items: { product: mongoose.Types.ObjectId; name: string; image: string; sku: string; price: number; quantity: number; customization?: any; subtotal: number }[];
  shippingAddress: { fullName: string; phone: string; line1: string; line2?: string; city: string; state: string; pincode: string; country: string };
  billingAddress?: any; sameAsBilling: boolean;
  subtotal: number; discountAmount: number; couponCode?: string;
  shippingCharge: number; taxAmount: number; taxRate: number; total: number;
  paymentMethod: PaymentMethod; paymentStatus: PaymentStatus;
  paymentDetails: { razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string; stripePaymentIntentId?: string; paidAt?: Date };
  orderStatus: OrderStatus;
  statusHistory: { status: string; timestamp: Date; note?: string; updatedBy?: mongoose.Types.ObjectId }[];
  trackingNumber?: string; courierName?: string; trackingUrl?: string;
  estimatedDelivery?: Date; deliveredAt?: Date;
  notes?: string; adminNotes?: string; invoiceUrl?: string;
  refundAmount?: number; refundReason?: string; refundedAt?: Date;
  createdAt: Date; updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  orderNumber: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  guestEmail: String, guestName: String,
  items: [{ product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, name: String, image: String, sku: String, price: Number, quantity: { type: Number, min: 1 }, customization: Schema.Types.Mixed, subtotal: Number }],
  shippingAddress: { fullName: { type: String, required: true }, phone: { type: String, required: true }, line1: { type: String, required: true }, line2: String, city: { type: String, required: true }, state: { type: String, required: true }, pincode: { type: String, required: true }, country: { type: String, default: 'India' } },
  billingAddress: Schema.Types.Mixed, sameAsBilling: { type: Boolean, default: true },
  subtotal: { type: Number, required: true }, discountAmount: { type: Number, default: 0 },
  couponCode: String, shippingCharge: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 }, taxRate: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['razorpay','gpay','stripe','cod'], required: true },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded','partially_refunded'], default: 'pending' },
  paymentDetails: { razorpayOrderId: String, razorpayPaymentId: String, razorpaySignature: String, stripePaymentIntentId: String, paidAt: Date },
  orderStatus: { type: String, enum: ['placed','confirmed','processing','shipped','delivered','cancelled','refunded'], default: 'placed' },
  statusHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String, updatedBy: { type: Schema.Types.ObjectId, ref: 'User' } }],
  trackingNumber: String, courierName: String, trackingUrl: String,
  estimatedDelivery: Date, deliveredAt: Date,
  notes: String, adminNotes: String, invoiceUrl: String,
  refundAmount: Number, refundReason: String, refundedAt: Date,
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `EL-${String(count + 1001).padStart(6,'0')}`;
    this.statusHistory.push({ status: 'placed', timestamp: new Date() });
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', orderSchema);
