import { Router } from 'express';
import { getProductReviews, createReview, updateReview, deleteReview, markHelpful, getAllReviewsAdmin, approveReview, replyToReview } from '../controllers/review.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';
import { uploadProductImages } from '../middleware/upload.middleware';

const router = Router();
router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, uploadProductImages.array('images', 3), createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.patch('/:id/helpful', protect, markHelpful);
router.get('/admin/all', protect, isAdmin, getAllReviewsAdmin);
router.patch('/admin/:id/approve', protect, isAdmin, approveReview);
router.post('/admin/:id/reply', protect, isAdmin, replyToReview);
export default router;
