// multer-cloudinary.config.ts
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});
