import fp from 'fastify-plugin';
import cookie, { FastifyCookieOptions } from '@fastify/cookie';

export const cookiePlugin = fp(async (fastify) => {
  await fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'super-secret-cookie-key',
    parseOptions: {}
  } as FastifyCookieOptions);
});
