import { Router } from 'express';
import { getPublishedBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, getAllBlogsAdmin } from '../controllers/blog.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';
import { uploadBlogImage } from '../middleware/upload.middleware';

const router = Router();
router.get('/', getPublishedBlogs);
router.get('/admin', protect, isAdmin, getAllBlogsAdmin);
router.get('/:slug', getBlogBySlug);
router.post('/admin', protect, isAdmin, uploadBlogImage.single('featuredImage'), createBlog);
router.put('/admin/:id', protect, isAdmin, uploadBlogImage.single('featuredImage'), updateBlog);
router.delete('/admin/:id', protect, isAdmin, deleteBlog);
export default router;
