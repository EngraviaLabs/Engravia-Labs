import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) return;
  try {
    if (publicId.startsWith('uploads/') || publicId.startsWith('/uploads/') || publicId.includes('uploads')) {
      const cleanPath = publicId.replace(/^\//, '');
      const fullPath = path.join(process.cwd(), cleanPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } else if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      !process.env.CLOUDINARY_CLOUD_NAME.includes('placeholder')
    ) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.warn('Delete image warning:', err);
  }
};

