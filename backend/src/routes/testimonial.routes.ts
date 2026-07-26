import { Router } from 'express';
import { getPublishedTestimonials, getAllTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';
import { uploadAvatarImage } from '../middleware/upload.middleware';

const router = Router();
router.get('/', getPublishedTestimonials);
router.get('/admin', protect, isAdmin, getAllTestimonialsAdmin);
router.post('/admin', protect, isAdmin, uploadAvatarImage.single('avatar'), createTestimonial);
router.put('/admin/:id', protect, isAdmin, uploadAvatarImage.single('avatar'), updateTestimonial);
router.delete('/admin/:id', protect, isAdmin, deleteTestimonial);
export default router;
