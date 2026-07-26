import { Request, Response, NextFunction } from 'express';
import Coupon from '../models/Coupon';
import { AppError } from '../middleware/error.middleware';

export const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, startsAt: { $lte: new Date() }, expiresAt: { $gte: new Date() } });
    if (!coupon) return next(new AppError('Invalid or expired coupon code.', 400));
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return next(new AppError('Coupon usage limit reached.', 400));
    if (orderAmount < (coupon.minOrderAmount || 0)) return next(new AppError(`Minimum order amount ₹${coupon.minOrderAmount} required.`, 400));
    let discount = 0;
    if (coupon.type === 'percentage') discount = Math.min((orderAmount * coupon.value) / 100, coupon.maxDiscount || Infinity);
    else if (coupon.type === 'fixed') discount = Math.min(coupon.value, orderAmount);
    else if (coupon.type === 'free_shipping') discount = 0;
    res.json({ success: true, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, discount: Math.round(discount) } });
  } catch (e) { next(e); }
};

export const getAllCoupons = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ success: true, coupons });
  } catch (e) { next(e); }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (e) { next(e); }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return next(new AppError('Coupon not found.', 404));
    res.json({ success: true, coupon });
  } catch (e) { next(e); }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return next(new AppError('Coupon not found.', 404));
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (e) { next(e); }
};
