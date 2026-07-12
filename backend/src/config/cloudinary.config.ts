import { z } from 'zod';
import { validateConfig } from './index';

const cloudinarySchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

export const cloudinaryConfig = validateConfig(cloudinarySchema, 'Cloudinary');
