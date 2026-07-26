import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string; slug: string; description?: string;
  image?: { url: string; publicId: string };
  parent?: mongoose.Types.ObjectId;
  displayOrder: number; isVisible: boolean; productCount: number;
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string[]; ogImage?: string };
  createdAt: Date; updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: String,
  image: { url: String, publicId: String },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  displayOrder: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
  seo: { metaTitle: String, metaDescription: String, keywords: [String], ogImage: String },
}, { timestamps: true });

categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1, isVisible: 1, displayOrder: 1 });

export default mongoose.model<ICategory>('Category', categorySchema);
