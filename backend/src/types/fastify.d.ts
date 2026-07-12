import { FastifyRequest, FastifyReply } from 'fastify';
import { Redis } from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    db: any; // We will replace with Drizzle types later
    redis: Redis;
    cloudinary: any; // We will replace with Cloudinary instance later
  }

  interface FastifyRequest {
    reqId: string;
    traceId: string;
    startTime: number;
    user?: any; // Replace with User entity type
    device?: any; // Replace with Device entity type
    session?: any; // Replace with Session entity type
  }
}
