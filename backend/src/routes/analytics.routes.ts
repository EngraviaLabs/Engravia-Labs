import { Router } from 'express';
import { getDashboardOverview, getRevenueChart, getTopProducts, getOrderStats } from '../controllers/analytics.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';

const router = Router();
router.get('/overview', protect, isAdmin, getDashboardOverview);
router.get('/revenue', protect, isAdmin, getRevenueChart);
router.get('/top-products', protect, isAdmin, getTopProducts);
router.get('/order-stats', protect, isAdmin, getOrderStats);
export default router;
