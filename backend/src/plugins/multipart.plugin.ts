import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

export const multipartPlugin = fp(async (fastify) => {
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });
});
