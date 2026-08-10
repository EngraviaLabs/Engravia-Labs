import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import reviewRoutes from './review.routes';
import couponRoutes from './coupon.routes';
import customOrderRoutes from './customOrder.routes';
import userRoutes from './user.routes';
import testimonialRoutes from './testimonial.routes';
import bannerRoutes from './banner.routes';
import blogRoutes from './blog.routes';
import paymentRoutes from './payment.routes';
import analyticsRoutes from './analytics.routes';
import seoRoutes from './seo.routes';
import contactRoutes from './contact.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/custom-orders', customOrderRoutes);
router.use('/users', userRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/banners', bannerRoutes);
router.use('/blogs', blogRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin/analytics', analyticsRoutes);
router.use('/seo', seoRoutes);
router.use('/contact', contactRoutes);

export default router;
