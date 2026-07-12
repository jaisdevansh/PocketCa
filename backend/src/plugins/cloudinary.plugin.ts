import fp from 'fastify-plugin';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../config/cloudinary.config';

export const cloudinaryPlugin = fp(async (fastify) => {
  cloudinary.config({
    cloud_name: cloudinaryConfig.CLOUDINARY_CLOUD_NAME,
    api_key: cloudinaryConfig.CLOUDINARY_API_KEY,
    api_secret: cloudinaryConfig.CLOUDINARY_API_SECRET,
  });

  fastify.decorate('cloudinary', cloudinary);
});
