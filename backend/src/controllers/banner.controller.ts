import { Request, Response, NextFunction } from 'express';
import Banner from '../models/Banner';
import { AppError } from '../middleware/error.middleware';
import { deleteFromCloudinary } from '../config/cloudinary';

export const getBannersByPlacement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await Banner.find({ placement: req.params.placement, isActive: true, $or: [{ endsAt: { $gte: new Date() } }, { endsAt: null }] }).sort('displayOrder');
    res.json({ success: true, banners });
  } catch (e) { next(e); }
};

export const getAllBannersAdmin = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await Banner.find().sort('displayOrder');
    res.json({ success: true, banners });
  } catch (e) { next(e); }
};

export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0] as any;
    const mobileFile = files?.mobileImage?.[0] as any;
    if (!imageFile) return next(new AppError('Banner image is required.', 400));
    const banner = await Banner.create({
      ...req.body,
      image: { url: imageFile.path, publicId: imageFile.filename },
      mobileImage: mobileFile ? { url: mobileFile.path, publicId: mobileFile.filename } : undefined,
    });
    res.status(201).json({ success: true, banner });
  } catch (e) { next(e); }
};

export const updateBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return next(new AppError('Banner not found.', 404));
    res.json({ success: true, banner });
  } catch (e) { next(e); }
};

export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return next(new AppError('Banner not found.', 404));
    if (banner.image?.publicId) await deleteFromCloudinary(banner.image.publicId);
    await banner.deleteOne();
    res.json({ success: true, message: 'Banner deleted.' });
  } catch (e) { next(e); }
};
