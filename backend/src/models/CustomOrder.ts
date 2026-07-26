import mongoose, { Schema, Document } from 'mongoose';
export type CustomOrderStatus = 'pending'|'reviewing'|'quoted'|'approved'|'in_production'|'completed'|'rejected'|'cancelled';
export interface ICustomOrder extends Document {
  user?: mongoose.Types.ObjectId; guestEmail?: string; guestName?: string; guestPhone?: string;
  productType: string; material: string; size?: string; color?: string;
  textRequirement?: string; fontStyle?: string; additionalNotes?: string;
  referenceImages: { url: string; publicId: string }[];
  status: CustomOrderStatus; quotedPrice?: number; quotationNote?: string; quotationFile?: string;
  statusHistory: { status: string; timestamp: Date; note?: string }[];
  adminNotes?: string; convertedOrderId?: mongoose.Types.ObjectId;
  createdAt: Date; updatedAt: Date;
}
const customOrderSchema = new Schema<ICustomOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  guestEmail: String, guestName: String, guestPhone: String,
  productType: { type: String, required: true },
  material: { type: String, required: true },
  size: String, color: String,
  textRequirement: { type: String, maxlength: 500 },
  fontStyle: String,
  additionalNotes: { type: String, maxlength: 1000 },
  referenceImages: [{ url: String, publicId: String }],
  status: { type: String, enum: ['pending','reviewing','quoted','approved','in_production','completed','rejected','cancelled'], default: 'pending' },
  quotedPrice: Number, quotationNote: String, quotationFile: String,
  statusHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
  adminNotes: String,
  convertedOrderId: { type: Schema.Types.ObjectId, ref: 'Order' },
}, { timestamps: true });
customOrderSchema.pre('save', function (next) {
  if (this.isModified('status')) this.statusHistory.push({ status: this.status, timestamp: new Date() });
  next();
});
customOrderSchema.index({ user: 1, createdAt: -1 });
customOrderSchema.index({ status: 1, createdAt: -1 });
export default mongoose.model<ICustomOrder>('CustomOrder', customOrderSchema);
