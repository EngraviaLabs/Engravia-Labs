import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import path from 'path';
import fs from 'fs';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  !process.env.CLOUDINARY_CLOUD_NAME.includes('placeholder') &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== '123456789012345' &&
  !process.env.CLOUDINARY_API_KEY.includes('placeholder') &&
  process.env.CLOUDINARY_API_SECRET &&
  !process.env.CLOUDINARY_API_SECRET.includes('placeholder')
);

const getBackendUrl = () => {
  return process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
};

const createLocalStorage = (folder: string) => {
  const uploadDir = path.join(process.cwd(), 'uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname) || '.jpg';
      const filename = `${folder}-${uniqueSuffix}${ext}`;
      cb(null, filename);
    },
  });
};

const createStorage = (folder: string) => {
  if (isCloudinaryConfigured) {
    return new CloudinaryStorage({
      cloudinary,
      params: {
        folder: `engravia-labs/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      } as any,
    });
  }

  const localStorage = createLocalStorage(folder);
  return {
    _handleFile: (req: any, file: Express.Multer.File, cb: any) => {
      localStorage._handleFile(req, file, (err: any, info: any) => {
        if (err) return cb(err);
        const hostUrl = getBackendUrl();
        const relativeUrl = `/uploads/${folder}/${info.filename}`;
        info.path = `${hostUrl}${relativeUrl}`;
        info.filename = `uploads/${folder}/${info.filename}`;
        cb(null, info);
      });
    },
    _removeFile: (req: any, file: Express.Multer.File, cb: any) => {
      localStorage._removeFile(req, file, cb);
    },
  };
};

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, PNG, and WebP allowed.'));
};

export const uploadProductImages = multer({ storage: createStorage('products'), fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 10 } });
export const uploadCategoryImage = multer({ storage: createStorage('categories'), fileFilter, limits: { fileSize: 3 * 1024 * 1024, files: 1 } });
export const uploadBannerImage = multer({ storage: createStorage('banners'), fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 2 } });
export const uploadAvatarImage = multer({ storage: createStorage('avatars'), fileFilter, limits: { fileSize: 2 * 1024 * 1024, files: 1 } });
export const uploadCustomOrderFiles = multer({ storage: createStorage('custom-orders'), fileFilter, limits: { fileSize: 8 * 1024 * 1024, files: 5 } });
export const uploadBlogImage = multer({ storage: createStorage('blog'), fileFilter, limits: { fileSize: 4 * 1024 * 1024, files: 1 } });

