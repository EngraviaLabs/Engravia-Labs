import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Review from '../models/Review';

export const getDashboardOverview = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue, monthRevenue, lastMonthRevenue,
      totalOrders, monthOrders, pendingOrders,
      totalProducts, totalUsers, totalReviews,
    ] = await Promise.all([
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ orderStatus: { $in: ['placed', 'confirmed', 'processing'] } }),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'customer' }),
      Review.countDocuments({ isApproved: false }),
    ]);

    const currentMonthRev = monthRevenue[0]?.total || 0;
    const lastMonthRev = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = lastMonthRev > 0 ? ((currentMonthRev - lastMonthRev) / lastMonthRev) * 100 : 0;

    res.json({
      success: true,
      overview: {
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: currentMonthRev,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        totalOrders, monthOrders, pendingOrders,
        totalProducts, totalUsers, pendingReviews: totalReviews,
      },
    });
  } catch (e) { next(e); }
};

export const getRevenueChart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate: Date;
    let groupBy: any;

    if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };
    }

    const data = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: startDate } } },
      { $group: { _id: groupBy, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    res.json({ success: true, data });
  } catch (e) { next(e); }
};

export const getTopProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ isActive: true }).sort('-salesCount').limit(10).select('name slug images salesCount rating numReviews price salePrice');
    res.json({ success: true, products });
  } catch (e) { next(e); }
};

export const getOrderStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);
    const paymentStats = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
    ]);
    res.json({ success: true, orderStats: stats, paymentStats });
  } catch (e) { next(e); }
};
