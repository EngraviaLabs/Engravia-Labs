import { Router } from 'express';
import { getAllUsersAdmin, getUserByIdAdmin, toggleUserStatus, toggleWishlist, getWishlist, getSettingsAdmin, updateSettingsAdmin, getPublicSettings } from '../controllers/user.controller';
import { protect, isAdmin, isSuperAdmin } from '../middleware/auth.middleware';

const router = Router();
router.get('/settings/public', getPublicSettings);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/toggle', protect, toggleWishlist);
router.get('/admin/settings', protect, isAdmin, getSettingsAdmin);
router.put('/admin/settings', protect, isAdmin, updateSettingsAdmin);
router.get('/admin', protect, isAdmin, getAllUsersAdmin);
router.get('/admin/:id', protect, isAdmin, getUserByIdAdmin);
router.patch('/admin/:id/toggle-status', protect, isSuperAdmin, toggleUserStatus);
export default router;
