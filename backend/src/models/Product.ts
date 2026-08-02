import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomizationField {
  name: string; type: 'text'|'select'|'upload'|'textarea'|'color'|'number';
  label: string; placeholder?: string; options?: string[];
  required: boolean; maxLength?: number; priceModifier?: number;
}

export interface IProduct extends Document {
  name: string; slug: string; sku: string;
  description: string; shortDescription?: string;
  category: mongoose.Types.ObjectId; subcategory?: mongoose.Types.ObjectId;
  images: { url: string; publicId: string; alt?: string; isPrimary: boolean; displayOrder: number }[];
  video?: { url: string; thumbnail?: string };
  price: number; salePrice?: number; costPrice?: number;
  stock: number; lowStockThreshold: number; trackInventory: boolean;
  material: string[]; colors: string[]; sizes: string[];
  dimensions?: { length: number; width: number; height: number; unit: string };
  weight?: { value: number; unit: string };
  customizationFields: ICustomizationField[];
  features: string[]; specifications: { key: string; value: string }[]; tags: string[];
  isFeatured: boolean; isBestSeller: boolean; isActive: boolean; isCustomizable: boolean;
  rating: number; numReviews: number; salesCount: number;
  relatedProducts: mongoose.Types.ObjectId[];
  seo: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string; ogImage?: string; keywords?: string[] };
  shippingInfo: { freeShipping: boolean; shippingCharge?: number; processingDays: number; weight?: number };
  createdAt: Date; updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  sku: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  shortDescription: String,
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: Schema.Types.ObjectId, ref: 'Category' },
  images: [{ url: String, publicId: String, alt: String, isPrimary: { type: Boolean, default: false }, displayOrder: { type: Number, default: 0 } }],
  video: { url: String, thumbnail: String },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  costPrice: { type: Number, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  trackInventory: { type: Boolean, default: true },
  material: [String], colors: [String], sizes: [String],
  dimensions: { length: Number, width: Number, height: Number, unit: { type: String, default: 'cm' } },
  weight: { value: Number, unit: { type: String, default: 'kg' } },
  customizationFields: [{ name: String, type: { type: String }, label: String, placeholder: String, options: [String], required: Boolean, maxLength: Number, priceModifier: { type: Number, default: 0 } }],
  features: [String],
  specifications: [{ key: String, value: String }],
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isCustomizable: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  seo: { metaTitle: String, metaDescription: String, canonicalUrl: String, ogImage: String, keywords: [String] },
  shippingInfo: { freeShipping: { type: Boolean, default: false }, shippingCharge: Number, processingDays: { type: Number, default: 2 }, weight: Number },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isBestSeller: 1, isActive: 1 });
productSchema.index({ price: 1, rating: -1 });

export default mongoose.model<IProduct>('Product', productSchema);
