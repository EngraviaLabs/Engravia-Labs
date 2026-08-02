import mongoose, { Schema, Document } from 'mongoose';
export interface IBlog extends Document {
  title: string; slug: string; excerpt: string; content: string;
  featuredImage?: { url: string; publicId: string; alt?: string };
  author: mongoose.Types.ObjectId;
  categories: string[]; tags: string[];
  status: 'draft'|'published'|'archived';
  publishedAt?: Date; viewCount: number;
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string[]; ogImage?: string; canonicalUrl?: string };
  createdAt: Date; updatedAt: Date;
}
const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, required: true, maxlength: 300 },
  content: { type: String, required: true },
  featuredImage: { url: String, publicId: String, alt: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categories: [String], tags: [String],
  status: { type: String, enum: ['draft','published','archived'], default: 'draft' },
  publishedAt: Date,
  viewCount: { type: Number, default: 0 },
  seo: { metaTitle: String, metaDescription: String, keywords: [String], ogImage: String, canonicalUrl: String },
}, { timestamps: true });
blogSchema.index({ status: 1, publishedAt: -1 });
export default mongoose.model<IBlog>('Blog', blogSchema);
