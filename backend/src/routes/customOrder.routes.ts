import { Router } from 'express';
import { createCustomOrder, getMyCustomOrders, getAllCustomOrdersAdmin, updateCustomOrderStatus } from '../controllers/customOrder.controller';
import { protect, isAdmin, optionalAuth } from '../middleware/auth.middleware';
import { uploadCustomOrderFiles } from '../middleware/upload.middleware';

const router = Router();
router.post('/', optionalAuth, uploadCustomOrderFiles.array('referenceImages', 5), createCustomOrder);
router.get('/my', protect, getMyCustomOrders);
router.get('/admin', protect, isAdmin, getAllCustomOrdersAdmin);
router.patch('/admin/:id/status', protect, isAdmin, updateCustomOrderStatus);
export default router;
