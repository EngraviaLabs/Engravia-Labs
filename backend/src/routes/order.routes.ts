import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus, getAdminOrderById } from '../controllers/order.controller';
import { protect, isAdmin, optionalAuth } from '../middleware/auth.middleware';

const router = Router();
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/my/:id', protect, getOrderById);
router.patch('/my/:id/cancel', protect, cancelOrder);
router.get('/admin', protect, isAdmin, getAllOrders);
router.get('/admin/:id', protect, isAdmin, getAdminOrderById);
router.patch('/admin/:id/status', protect, isAdmin, updateOrderStatus);
export default router;
