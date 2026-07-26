import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import { AppError } from '../middleware/error.middleware';
import { deleteFromCloudinary } from '../config/cloudinary';
import slugify from '../utils/slugify';

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({ isVisible: true })
      .sort('displayOrder').populate('parent', 'name slug');
    res.json({ success: true, categories });
  } catch (e) { next(e); }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isVisible: true });
    if (!category) return next(new AppError('Category not found.', 404));
    res.json({ success: true, category });
  } catch (e) { next(e); }
};

export const getAllCategoriesAdmin = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find().sort('displayOrder').populate('parent', 'name slug');
    res.json({ success: true, categories });
  } catch (e) { next(e); }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let slug = slugify(req.body.name);
    let count = 0;
    while (await Category.findOne({ slug: count ? `${slug}-${count}` : slug })) count++;
    if (count) slug = `${slug}-${count}`;
    const image = req.file ? { url: (req.file as any).path, publicId: (req.file as any).filename } : undefined;
    const category = await Category.create({ ...req.body, slug, image, seo: req.body.seo ? JSON.parse(req.body.seo) : {} });
    res.status(201).json({ success: true, category });
  } catch (e) { next(e); }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found.', 404));
    const updates: any = { ...req.body };
    if (req.body.name && req.body.name !== category.name) updates.slug = slugify(req.body.name);
    if (req.file) {
      if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
      updates.image = { url: (req.file as any).path, publicId: (req.file as any).filename };
    }
    if (req.body.seo && typeof req.body.seo === 'string') updates.seo = JSON.parse(req.body.seo);
    const updated = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, category: updated });
  } catch (e) { next(e); }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found.', 404));
    if (category.productCount > 0) return next(new AppError('Cannot delete category with products.', 400));
    if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted.' });
  } catch (e) { next(e); }
};

export const toggleCategoryVisibility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found.', 404));
    category.isVisible = !category.isVisible;
    await category.save();
    res.json({ success: true, category });
  } catch (e) { next(e); }
};
