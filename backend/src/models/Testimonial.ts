import mongoose, { Schema, Document } from 'mongoose';
export interface ITestimonial extends Document {
  name: string; location?: string;
  avatar?: { url: string; publicId: string };
  rating: number; title?: string; text: string;
  productName?: string; isPublished: boolean; displayOrder: number;
  createdAt: Date;
}
const testimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  location: String,
  avatar: { url: String, publicId: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  text: { type: String, required: true, maxlength: 800 },
  productName: String,
  isPublished: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });
testimonialSchema.index({ isPublished: 1, displayOrder: 1 });
export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
