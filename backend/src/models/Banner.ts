import mongoose, { Schema, Document } from 'mongoose';
export interface IBanner extends Document {
  title: string; subtitle?: string; description?: string;
  image: { url: string; publicId: string; alt?: string };
  mobileImage?: { url: string; publicId: string };
  ctaText?: string; ctaLink?: string; ctaSecondaryText?: string; ctaSecondaryLink?: string;
  placement: 'hero'|'collection'|'product'|'popup'|'banner_strip';
  isActive: boolean; displayOrder: number; startsAt?: Date; endsAt?: Date;
  createdAt: Date;
}
const bannerSchema = new Schema<IBanner>({
  title: { type: String, required: true }, subtitle: String, description: String,
  image: { url: { type: String, required: true }, publicId: String, alt: String },
  mobileImage: { url: String, publicId: String },
  ctaText: String, ctaLink: String, ctaSecondaryText: String, ctaSecondaryLink: String,
  placement: { type: String, enum: ['hero','collection','product','popup','banner_strip'], required: true },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  startsAt: Date, endsAt: Date,
}, { timestamps: true });
bannerSchema.index({ placement: 1, isActive: 1, displayOrder: 1 });
export default mongoose.model<IBanner>('Banner', bannerSchema);
