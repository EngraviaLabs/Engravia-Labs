import { Router } from 'express';
import { getBannersByPlacement, getAllBannersAdmin, createBanner, updateBanner, deleteBanner } from '../controllers/banner.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';
import { uploadBannerImage } from '../middleware/upload.middleware';

const router = Router();
router.get('/placement/:placement', getBannersByPlacement);
router.get('/admin', protect, isAdmin, getAllBannersAdmin);
router.post('/admin', protect, isAdmin, uploadBannerImage.fields([{ name: 'image', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), createBanner);
router.put('/admin/:id', protect, isAdmin, updateBanner);
router.delete('/admin/:id', protect, isAdmin, deleteBanner);
export default router;
