import { Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import slugify from '../utils/slugify';
import { getPaginationData } from '../utils/pagination';

export const getPublishedBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 9, category, tag, search } = req.query;
    const filter: any = { status: 'published' };
    if (category) filter.categories = category;
    if (tag) filter.tags = tag;
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { excerpt: { $regex: search, $options: 'i' } }];
    const skip = (+page - 1) * +limit;
    const [blogs, total] = await Promise.all([
      Blog.find(filter).populate('author', 'name avatar').sort('-publishedAt').skip(skip).limit(+limit).select('-content'),
      Blog.countDocuments(filter),
    ]);
    res.json({ success: true, blogs, pagination: getPaginationData(+page, +limit, total, blogs.length) });
  } catch (e) { next(e); }
};

export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findOneAndUpdate({ slug: req.params.slug, status: 'published' }, { $inc: { viewCount: 1 } }, { new: true }).populate('author', 'name avatar');
    if (!blog) return next(new AppError('Blog post not found.', 404));
    res.json({ success: true, blog });
  } catch (e) { next(e); }
};

export const createBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let slug = slugify(req.body.title); let count = 0;
    while (await Blog.findOne({ slug: count ? `${slug}-${count}` : slug })) count++;
    if (count) slug = `${slug}-${count}`;
    const featuredImage = req.file ? { url: (req.file as any).path, publicId: (req.file as any).filename } : undefined;
    const blog = await Blog.create({
      ...req.body, slug, author: req.user!.id, featuredImage,
      publishedAt: req.body.status === 'published' ? new Date() : undefined,
      categories: req.body.categories ? JSON.parse(req.body.categories) : [],
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      seo: req.body.seo ? JSON.parse(req.body.seo) : {},
    });
    res.status(201).json({ success: true, blog });
  } catch (e) { next(e); }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates: any = { ...req.body };
    if (req.body.status === 'published') {
      const existing = await Blog.findById(req.params.id);
      if (existing && existing.status !== 'published') updates.publishedAt = new Date();
    }
    ['categories', 'tags', 'seo'].forEach(f => { if (updates[f] && typeof updates[f] === 'string') { try { updates[f] = JSON.parse(updates[f]); } catch {} } });
    if (req.file) updates.featuredImage = { url: (req.file as any).path, publicId: (req.file as any).filename };
    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!blog) return next(new AppError('Blog not found.', 404));
    res.json({ success: true, blog });
  } catch (e) { next(e); }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return next(new AppError('Blog not found.', 404));
    res.json({ success: true, message: 'Blog deleted.' });
  } catch (e) { next(e); }
};

export const getAllBlogsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    const skip = (+page - 1) * +limit;
    const [blogs, total] = await Promise.all([
      Blog.find(filter).populate('author', 'name').sort('-createdAt').skip(skip).limit(+limit).select('-content'),
      Blog.countDocuments(filter),
    ]);
    res.json({ success: true, blogs, pagination: getPaginationData(+page, +limit, total, blogs.length) });
  } catch (e) { next(e); }
};
