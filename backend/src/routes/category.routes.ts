import { Router } from 'express';
import { getCategories, getCategoryBySlug, getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory, toggleCategoryVisibility } from '../controllers/category.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';
import { uploadCategoryImage } from '../middleware/upload.middleware';

const router = Router();
router.get('/', getCategories);
router.get('/admin/all', protect, isAdmin, getAllCategoriesAdmin);
router.get('/:slug', getCategoryBySlug);
router.post('/', protect, isAdmin, uploadCategoryImage.single('image'), createCategory);
router.put('/:id', protect, isAdmin, uploadCategoryImage.single('image'), updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);
router.patch('/:id/toggle-visibility', protect, isAdmin, toggleCategoryVisibility);
export default router;
