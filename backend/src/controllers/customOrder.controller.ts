import { Request, Response, NextFunction } from 'express';
import CustomOrder from '../models/CustomOrder';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import emailService from '../services/email.service';
import { getPaginationData } from '../utils/pagination';

export const createCustomOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const images = ((req.files as any[]) || []).map((f: any) => ({ url: f.path, publicId: f.filename }));
    const customOrder = await CustomOrder.create({
      ...req.body, user: req.user?.id, referenceImages: images,
    });
    const email = req.user?.email || req.body.guestEmail;
    const name = req.body.guestName || 'Valued Customer';
    if (email) await emailService.sendCustomOrderReceived(email, name);
    res.status(201).json({ success: true, customOrder });
  } catch (e) { next(e); }
};

export const getMyCustomOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await CustomOrder.find({ user: req.user!.id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (e) { next(e); }
};

export const getAllCustomOrdersAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    const skip = (+page - 1) * +limit;
    const [orders, total] = await Promise.all([
      CustomOrder.find(filter).populate('user', 'name email phone').sort('-createdAt').skip(skip).limit(+limit),
      CustomOrder.countDocuments(filter),
    ]);
    res.json({ success: true, orders, pagination: getPaginationData(+page, +limit, total, orders.length) });
  } catch (e) { next(e); }
};

export const updateCustomOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, note, quotedPrice, quotationNote, quotationFile } = req.body;
    const order = await CustomOrder.findById(req.params.id).populate('user', 'name email');
    if (!order) return next(new AppError('Custom order not found.', 404));
    order.status = status;
    if (quotedPrice) order.quotedPrice = quotedPrice;
    if (quotationNote) order.quotationNote = quotationNote;
    if (quotationFile) order.quotationFile = quotationFile;
    if (note) order.statusHistory[order.statusHistory.length - 1].note = note;
    await order.save();
    res.json({ success: true, order });
  } catch (e) { next(e); }
};
