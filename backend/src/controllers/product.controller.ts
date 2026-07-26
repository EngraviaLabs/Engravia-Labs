import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';
import { AppError } from '../middleware/error.middleware';
import { deleteFromCloudinary } from '../config/cloudinary';
import slugify from '../utils/slugify';
import { generateSKU } from '../utils/generateSKU';
import { getPaginationData } from '../utils/pagination';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page=1,limit=12,sort='-createdAt',category,slug,minPrice,maxPrice,material,color,rating,search,featured,bestseller } = req.query;
    const filter: any = { isActive: true };

    if (slug) {
      const cat = await Category.findOne({ slug: slug as string });
      if (cat) {
        filter.category = cat._id;
      } else {
        filter.category = new mongoose.Types.ObjectId();
      }
    } else if (category) {
      if (mongoose.Types.ObjectId.isValid(category as string)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category as string });
        if (cat) {
          filter.category = cat._id;
        } else {
          filter.category = new mongoose.Types.ObjectId();
        }
      }
    }
    if (featured === 'true') filter.isFeatured = true;
    if (bestseller === 'true') filter.isBestSeller = true;
    if (minPrice || maxPrice) {
      filter.$or = [
        { salePrice: { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) } },
        { price: { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) } },
      ];
    }
    if (material) filter.material = { $in: (material as string).split(',') };
    if (color) filter.colors = { $in: (color as string).split(',') };
    if (rating) filter.rating = { $gte: +rating };
    if (search) filter.$text = { $search: search as string };
    const skip = (+page - 1) * +limit;
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category','name slug').sort(sort as string).skip(skip).limit(+limit).select('-customizationFields -seo'),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, products, pagination: getPaginationData(+page, +limit, total, products.length) });
  } catch (e) { next(e); }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category','name slug')
      .populate('relatedProducts','name slug images price salePrice rating numReviews');
    if (!product) return next(new AppError('Product not found.', 404));
    res.json({ success: true, product });
  } catch (e) { next(e); }
};

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(8).sort('-createdAt')
      .populate('category','name slug').select('name slug images price salePrice rating numReviews category isBestSeller');
    res.json({ success: true, products });
  } catch (e) { next(e); }
};

export const getBestSellers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ isBestSeller: true, isActive: true }).limit(8).sort('-salesCount')
      .populate('category','name slug').select('name slug images price salePrice rating numReviews category');
    res.json({ success: true, products });
  } catch (e) { next(e); }
};

export const getNewArrivals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ isActive: true }).limit(8).sort('-createdAt')
      .populate('category','name slug').select('name slug images price salePrice rating numReviews category');
    res.json({ success: true, products });
  } catch (e) { next(e); }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category } = req.body;
    const cat = await Category.findById(category);
    if (!cat) return next(new AppError('Category not found.', 404));
    const slug = await genUniqueSlug(name);
    const sku = await generateSKU(cat.name);
    const images = ((req.files as Express.Multer.File[]) || []).map((f: any, i: number) => ({
      url: f.path, publicId: f.filename, isPrimary: i === 0, displayOrder: i,
    }));
    const parseJSON = (v: any) => { try { return typeof v === 'string' ? JSON.parse(v) : v; } catch { return v; } };
    const product = await Product.create({
      ...req.body, slug, sku, images,
      customizationFields: parseJSON(req.body.customizationFields) || [],
      specifications: parseJSON(req.body.specifications) || [],
      features: parseJSON(req.body.features) || [],
      tags: parseJSON(req.body.tags) || [],
      material: parseJSON(req.body.material) || [],
      seo: parseJSON(req.body.seo) || {},
      shippingInfo: parseJSON(req.body.shippingInfo) || {},
    });
    await Category.findByIdAndUpdate(category, { $inc: { productCount: 1 } });
    res.status(201).json({ success: true, product });
  } catch (e) { next(e); }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));
    const updates: any = { ...req.body };
    if (req.body.name && req.body.name !== product.name) updates.slug = await genUniqueSlug(req.body.name, req.params.id);
    ['customizationFields','specifications','features','tags','material','seo','shippingInfo'].forEach(f => {
      if (updates[f] && typeof updates[f] === 'string') { try { updates[f] = JSON.parse(updates[f]); } catch {} }
    });
    if (req.files && (req.files as any[]).length > 0) {
      const newImgs = (req.files as any[]).map((f, i) => ({ url: f.path, publicId: f.filename, isPrimary: false, displayOrder: product.images.length + i }));
      updates.images = [...product.images, ...newImgs];
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, product: updated });
  } catch (e) { next(e); }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));
    await Promise.all(product.images.map(img => deleteFromCloudinary(img.publicId)));
    await product.deleteOne();
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
    res.json({ success: true, message: 'Product deleted.' });
  } catch (e) { next(e); }
};

export const toggleProductFlag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const field = req.params.flag === 'featured' ? 'isFeatured' : 'isBestSeller';
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));
    (product as any)[field] = !(product as any)[field];
    await product.save();
    res.json({ success: true, product });
  } catch (e) { next(e); }
};

export const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicId } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));
    await deleteFromCloudinary(publicId);
    product.images = product.images.filter(img => img.publicId !== publicId);
    if (product.images.length && !product.images.some(img => img.isPrimary)) product.images[0].isPrimary = true;
    await product.save();
    res.json({ success: true, product });
  } catch (e) { next(e); }
};

async function genUniqueSlug(name: string, excludeId?: string) {
  let slug = slugify(name); let count = 0;
  while (true) {
    const candidate = count === 0 ? slug : `${slug}-${count}`;
    const q: any = { slug: candidate };
    if (excludeId) q._id = { $ne: excludeId };
    if (!(await Product.findOne(q))) return candidate;
    count++;
  }
}
