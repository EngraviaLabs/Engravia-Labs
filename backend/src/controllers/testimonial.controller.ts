import { Request, Response, NextFunction } from 'express';
import Testimonial from '../models/Testimonial';
import { AppError } from '../middleware/error.middleware';
import { deleteFromCloudinary } from '../config/cloudinary';

export const getPublishedTestimonials = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await Testimonial.find({ isPublished: true }).sort('displayOrder');
    res.json({ success: true, testimonials });
  } catch (e) { next(e); }
};

export const getAllTestimonialsAdmin = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await Testimonial.find().sort('displayOrder');
    res.json({ success: true, testimonials });
  } catch (e) { next(e); }
};

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const avatar = req.file ? { url: (req.file as any).path, publicId: (req.file as any).filename } : undefined;
    const t = await Testimonial.create({ ...req.body, avatar });
    res.status(201).json({ success: true, testimonial: t });
  } catch (e) { next(e); }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return next(new AppError('Testimonial not found.', 404));
    const updates: any = { ...req.body };
    if (req.file) {
      if (t.avatar?.publicId) await deleteFromCloudinary(t.avatar.publicId);
      updates.avatar = { url: (req.file as any).path, publicId: (req.file as any).filename };
    }
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, testimonial: updated });
  } catch (e) { next(e); }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return next(new AppError('Testimonial not found.', 404));
    if (t.avatar?.publicId) await deleteFromCloudinary(t.avatar.publicId);
    await t.deleteOne();
    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (e) { next(e); }
};
