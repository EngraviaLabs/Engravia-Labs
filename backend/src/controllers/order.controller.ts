import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Coupon from '../models/Coupon';
import User from '../models/User';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import emailService from '../services/email.service';
import { getPaginationData } from '../utils/pagination';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError('Please sign in to place your order.', 401));
    }
    const { items, shippingAddress, paymentMethod, couponCode, notes, guestEmail, guestName, sameAsBilling, billingAddress } = req.body;
    
    // Validate items and compute subtotal
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) return next(new AppError(`Product ${item.productId} not found.`, 404));
      if (product.trackInventory && product.stock < item.quantity) return next(new AppError(`Insufficient stock for ${product.name}.`, 400));
      const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({ product: product._id, name: product.name, image: product.images[0]?.url || '', sku: product.sku, price, quantity: item.quantity, customization: item.customization, subtotal: itemTotal });
    }
    
    // Coupon
    let discountAmount = 0; let couponDoc = null;
    if (couponCode) {
      couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, startsAt: { $lte: new Date() }, expiresAt: { $gte: new Date() } });
      if (!couponDoc) return next(new AppError('Invalid or expired coupon.', 400));
      if (couponDoc.usageLimit && couponDoc.usedCount >= couponDoc.usageLimit) return next(new AppError('Coupon usage limit reached.', 400));
      if (subtotal < (couponDoc.minOrderAmount || 0)) return next(new AppError(`Minimum order ₹${couponDoc.minOrderAmount} required.`, 400));
      if (couponDoc.type === 'percentage') { discountAmount = Math.min((subtotal * couponDoc.value) / 100, couponDoc.maxDiscount || Infinity); }
      else if (couponDoc.type === 'fixed') { discountAmount = Math.min(couponDoc.value, subtotal); }
    }
    
    const shippingCharge = subtotal - discountAmount > 999 ? 0 : 99;
    const taxRate = 0.18;
    const taxableAmount = subtotal - discountAmount + shippingCharge;
    const taxAmount = Math.round(taxableAmount * taxRate);
    const total = taxableAmount + taxAmount;
    
    const isOnlinePayment = paymentMethod === 'razorpay' || paymentMethod === 'stripe';

    const order = await Order.create({
      user: req.user?.id, guestEmail, guestName, items: orderItems,
      shippingAddress, billingAddress, sameAsBilling,
      subtotal, discountAmount, couponCode, shippingCharge, taxAmount, taxRate, total,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'placed',
      notes,
    });
    
    // For COD orders: Confirm order, decrement stock, update stats, and send email immediately!
    if (paymentMethod === 'cod') {
      // Decrement stock
      await Promise.all(items.map((item: any) => Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity, salesCount: item.quantity } })));
      
      // Update coupon usage
      if (couponDoc && req.user?.id) {
        await Coupon.findByIdAndUpdate(couponDoc._id, { $inc: { usedCount: 1 }, $push: { usedBy: { user: req.user.id, orderId: order._id } } });
      }
      
      // Update user stats
      if (req.user?.id) {
        await User.findByIdAndUpdate(req.user.id, { $inc: { totalOrders: 1, totalSpent: total } });
      }
      
      // Send confirmation email
      const emailTo = req.user?.email || guestEmail;
      if (emailTo) await emailService.sendOrderConfirmation(emailTo, guestName || 'Valued Customer', order);
    }
    
    res.status(201).json({ success: true, order });
  } catch (e) { next(e); }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page=1, limit=10 } = req.query;
    const skip = (+page-1) * +limit;
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user!.id }).sort('-createdAt').skip(skip).limit(+limit).select('-adminNotes -paymentDetails'),
      Order.countDocuments({ user: req.user!.id }),
    ]);
    res.json({ success: true, orders, pagination: getPaginationData(+page, +limit, total, orders.length) });
  } catch (e) { next(e); }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!.id }).populate('items.product','name slug images');
    if (!order) return next(new AppError('Order not found.', 404));
    res.json({ success: true, order });
  } catch (e) { next(e); }
};

export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!.id });
    if (!order) return next(new AppError('Order not found.', 404));
    if (!['placed','confirmed'].includes(order.orderStatus)) return next(new AppError('Order cannot be cancelled at this stage.', 400));
    order.orderStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), note: req.body.reason || 'Cancelled by customer' });
    await order.save();
    // Restore stock
    await Promise.all(order.items.map(item => Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, salesCount: -item.quantity } })));
    res.json({ success: true, order });
  } catch (e) { next(e); }
};

// Admin controllers
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page=1, limit=20, status, paymentStatus, search, startDate, endDate } = req.query;
    const filter: any = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (startDate || endDate) filter.createdAt = { ...(startDate && { $gte: new Date(startDate as string) }), ...(endDate && { $lte: new Date(endDate as string) }) };
    if (search) filter.$or = [{ orderNumber: { $regex: search, $options:'i' } }, { guestEmail: { $regex: search, $options:'i' } }];
    const skip = (+page-1) * +limit;
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user','name email').sort('-createdAt').skip(skip).limit(+limit),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, orders, pagination: getPaginationData(+page, +limit, total, orders.length) });
  } catch (e) { next(e); }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, note, trackingNumber, courierName, trackingUrl, estimatedDelivery } = req.body;
    const order = await Order.findById(req.params.id).populate('user','name email');
    if (!order) return next(new AppError('Order not found.', 404));
    const prevStatus = order.orderStatus;
    order.orderStatus = status;
    order.statusHistory.push({ status, timestamp: new Date(), note, updatedBy: (req as AuthRequest).user?.id as any });
    if (trackingNumber) { order.trackingNumber = trackingNumber; order.courierName = courierName; order.trackingUrl = trackingUrl; }
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();
    // Send status email
    const user = order.user as any;
    const emailTo = user?.email || order.guestEmail;
    if (emailTo && prevStatus !== status) await emailService.sendOrderStatusUpdate(emailTo, user?.name || 'Customer', order.orderNumber, status, note);
    res.json({ success: true, order });
  } catch (e) { next(e); }
};

export const getAdminOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id).populate('user','name email phone').populate('items.product','name sku');
    if (!order) return next(new AppError('Order not found.', 404));
    res.json({ success: true, order });
  } catch (e) { next(e); }
};
