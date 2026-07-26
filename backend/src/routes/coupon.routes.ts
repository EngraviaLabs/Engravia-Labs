import { Router } from 'express';
import { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/coupon.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';

const router = Router();
router.post('/validate', validateCoupon);
router.get('/admin', protect, isAdmin, getAllCoupons);
router.post('/admin', protect, isAdmin, createCoupon);
router.put('/admin/:id', protect, isAdmin, updateCoupon);
router.delete('/admin/:id', protect, isAdmin, deleteCoupon);
export default router;
