import { Router } from 'express';
import { getProducts, getProductBySlug, getFeaturedProducts, getBestSellers, getNewArrivals, createProduct, updateProduct, deleteProduct, toggleProductFlag, deleteProductImage } from '../controllers/product.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';
import { uploadProductImages } from '../middleware/upload.middleware';

const router = Router();
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/:slug', getProductBySlug);
router.post('/', protect, isAdmin, uploadProductImages.array('images', 10), createProduct);
router.put('/:id', protect, isAdmin, uploadProductImages.array('images', 10), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);
router.patch('/:id/toggle/:flag', protect, isAdmin, toggleProductFlag);
router.delete('/:id/image', protect, isAdmin, deleteProductImage);
export default router;
