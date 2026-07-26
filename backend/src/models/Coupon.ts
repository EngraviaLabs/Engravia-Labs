import mongoose, { Schema, Document } from 'mongoose';
export interface ICoupon extends Document {
  code: string; description?: string;
  type: 'percentage'|'fixed'|'free_shipping';
  value: number; minOrderAmount?: number; maxDiscount?: number;
  usageLimit?: number; usedCount: number; perUserLimit: number;
  isActive: boolean; startsAt: Date; expiresAt: Date;
  usedBy: { user: mongoose.Types.ObjectId; usedAt: Date; orderId: mongoose.Types.ObjectId }[];
}
const couponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: String,
  type: { type: String, enum: ['percentage','fixed','free_shipping'], required: true },
  value: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: Number,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  startsAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  usedBy: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, usedAt: { type: Date, default: Date.now }, orderId: { type: Schema.Types.ObjectId, ref: 'Order' } }],
}, { timestamps: true });
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, expiresAt: 1 });
export default mongoose.model<ICoupon>('Coupon', couponSchema);
