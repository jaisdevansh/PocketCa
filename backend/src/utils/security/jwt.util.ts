import { FastifyInstance } from 'fastify';

export interface JwtPayload {
  userId: string;
  sessionId: string;
  deviceId: string;
  role: string;
  permissions: string[];
  tokenVersion: number;
}

export class JwtUtil {
  /**
   * Generates a short-lived Access Token (15m)
   */
  static generateAccessToken(fastify: FastifyInstance, payload: JwtPayload): string {
    return fastify.jwt.sign(payload, { expiresIn: '15m' });
  }

  /**
   * Verifies an Access Token
   */
  static verifyAccessToken(fastify: FastifyInstance, token: string): JwtPayload {
    return fastify.jwt.verify<JwtPayload>(token);
  }
}
