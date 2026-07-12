import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { jwtConfig } from '../config/jwt.config';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/custom-exceptions';
import { eq } from 'drizzle-orm';
import { db } from '../database/connection/database';
import { sessions } from '../database/schema/auth';

export const jwtPlugin = fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: jwtConfig.JWT_SECRET,
  });

  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
      
      const user = request.user as any;
      if (!user || !user.sessionId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      // Check if session is revoked in DB (In high scale, use Redis for this check)
      const sessionRecords = await db.select().from(sessions).where(eq(sessions.id, user.sessionId)).limit(1);
      const session = sessionRecords[0];

      if (!session || session.revoked) {
        throw new AppError('Session expired or revoked', 401, 'SESSION_REVOKED');
      }

    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate('requireRole', function (roles: string[]) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      const user = request.user as any;
      if (!user || !roles.includes(user.role)) {
        throw new AppError('Forbidden', 403, 'FORBIDDEN');
      }
    };
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
