import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const createStorage = (folder: string) => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `engravia-labs/${folder}`,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  } as any,
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (['image/jpeg','image/jpg','image/png','image/webp'].includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, PNG, and WebP allowed.'));
};

export const uploadProductImages = multer({ storage: createStorage('products'), fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 10 } });
export const uploadCategoryImage = multer({ storage: createStorage('categories'), fileFilter, limits: { fileSize: 3 * 1024 * 1024, files: 1 } });
export const uploadBannerImage = multer({ storage: createStorage('banners'), fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 2 } });
export const uploadAvatarImage = multer({ storage: createStorage('avatars'), fileFilter, limits: { fileSize: 2 * 1024 * 1024, files: 1 } });
export const uploadCustomOrderFiles = multer({ storage: createStorage('custom-orders'), fileFilter, limits: { fileSize: 8 * 1024 * 1024, files: 5 } });
export const uploadBlogImage = multer({ storage: createStorage('blog'), fileFilter, limits: { fileSize: 4 * 1024 * 1024, files: 1 } });
