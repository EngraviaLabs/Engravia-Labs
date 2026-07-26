import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { getPaginationData } from '../utils/pagination';

export const getAllUsersAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const filter: any = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const skip = (+page - 1) * +limit;
    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(+limit).select('-password -refreshToken'),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, users, pagination: getPaginationData(+page, +limit, total, users.length) });
  } catch (e) { next(e); }
};

export const getUserByIdAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) return next(new AppError('User not found.', 404));
    res.json({ success: true, user });
  } catch (e) { next(e); }
};

export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found.', 404));
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (e) { next(e); }
};

export const toggleWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found.', 404));
    const user = await User.findById(req.user!.id);
    if (!user) return next(new AppError('User not found.', 404));
    const idx = user.wishlist.findIndex(id => id.toString() === productId);
    if (idx > -1) user.wishlist.splice(idx, 1);
    else user.wishlist.push(productId as any);
    await user.save();
    res.json({ success: true, wishlist: user.wishlist, added: idx === -1 });
  } catch (e) { next(e); }
};

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id).populate('wishlist', 'name slug images price salePrice rating numReviews isActive');
    if (!user) return next(new AppError('User not found.', 404));
    res.json({ success: true, wishlist: user.wishlist });
  } catch (e) { next(e); }
};

export const getSettingsAdmin = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const Setting = (await import('../models/Setting')).default;
    const settings = await Setting.find();
    const grouped = settings.reduce((acc: any, s) => { if (!acc[s.group]) acc[s.group] = {}; acc[s.group][s.key] = s.value; return acc; }, {});
    res.json({ success: true, settings: grouped });
  } catch (e) { next(e); }
};

export const getPublicSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const Setting = (await import('../models/Setting')).default;
    const settings = await Setting.find();
    const grouped = settings.reduce((acc: any, s) => { if (!acc[s.group]) acc[s.group] = {}; acc[s.group][s.key] = s.value; return acc; }, {});
    res.json({ success: true, settings: grouped });
  } catch (e) { next(e); }
};

export const updateSettingsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Setting = (await import('../models/Setting')).default;
    const updates = req.body;
    await Promise.all(Object.entries(updates).map(([key, value]) =>
      Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
    ));
    res.json({ success: true, message: 'Settings updated.' });
  } catch (e) { next(e); }
};
