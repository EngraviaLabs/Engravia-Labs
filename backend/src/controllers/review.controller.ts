import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { getPaginationData } from '../utils/pagination';

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (+page - 1) * +limit;
    const filter = { product: req.params.productId, isApproved: true, isPublished: true };
    const [reviews, total] = await Promise.all([
      Review.find(filter).populate('user', 'name avatar').sort(sort as string).skip(skip).limit(+limit),
      Review.countDocuments(filter),
    ]);
    res.json({ success: true, reviews, pagination: getPaginationData(+page, +limit, total, reviews.length) });
  } catch (e) { next(e); }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await Review.findOne({ product: req.params.productId, user: req.user!.id });
    if (existing) return next(new AppError('You have already reviewed this product.', 400));
    const verifiedOrder = await Order.findOne({
      user: req.user!.id, 'items.product': req.params.productId, orderStatus: 'delivered',
    });
    const images = ((req.files as any[]) || []).map((f: any) => ({ url: f.path, publicId: f.filename }));
    const review = await Review.create({
      ...req.body, product: req.params.productId, user: req.user!.id,
      order: verifiedOrder?._id, isVerifiedPurchase: !!verifiedOrder, images,
    });
    res.status(201).json({ success: true, review });
  } catch (e) { next(e); }
};

export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user!.id });
    if (!review) return next(new AppError('Review not found.', 404));
    const updated = await Review.findByIdAndUpdate(req.params.id, { rating: req.body.rating, title: req.body.title, body: req.body.body }, { new: true, runValidators: true });
    res.json({ success: true, review: updated });
  } catch (e) { next(e); }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user!.id });
    if (!review) return next(new AppError('Review not found.', 404));
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted.' });
  } catch (e) { next(e); }
};

export const markHelpful = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found.', 404));
    const idx = review.helpfulVotes.indexOf(req.user!.id as any);
    if (idx > -1) review.helpfulVotes.splice(idx, 1);
    else review.helpfulVotes.push(req.user!.id as any);
    await review.save();
    res.json({ success: true, helpfulCount: review.helpfulVotes.length });
  } catch (e) { next(e); }
};

// Admin
export const getAllReviewsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, approved } = req.query;
    const filter: any = {};
    if (approved !== undefined) filter.isApproved = approved === 'true';
    const skip = (+page - 1) * +limit;
    const [reviews, total] = await Promise.all([
      Review.find(filter).populate('user', 'name email').populate('product', 'name slug').sort('-createdAt').skip(skip).limit(+limit),
      Review.countDocuments(filter),
    ]);
    res.json({ success: true, reviews, pagination: getPaginationData(+page, +limit, total, reviews.length) });
  } catch (e) { next(e); }
};

export const approveReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true, isPublished: true }, { new: true });
    if (!review) return next(new AppError('Review not found.', 404));
    res.json({ success: true, review });
  } catch (e) { next(e); }
};

export const replyToReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { adminReply: { text: req.body.text, repliedAt: new Date() } }, { new: true });
    if (!review) return next(new AppError('Review not found.', 404));
    res.json({ success: true, review });
  } catch (e) { next(e); }
};
