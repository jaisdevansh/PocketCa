import crypto from 'crypto';
import { FastifyRequest } from 'fastify';

export class DeviceUtil {
  /**
   * Generates a unique device fingerprint hash based on headers and IP.
   * This is a simple implementation. In a real fintech app, use SDKs like FingerprintJS or Play Integrity API.
   */
  static generateFingerprint(request: FastifyRequest): string {
    const ip = request.ip || 'unknown-ip';
    const userAgent = request.headers['user-agent'] || 'unknown-agent';
    const acceptLanguage = request.headers['accept-language'] || 'unknown-lang';
    
    // In production, we'd add client-side fingerprinting. 
    // Here we use network characteristics.
    const rawData = `${ip}|${userAgent}|${acceptLanguage}`;
    
    return crypto.createHash('sha256').update(rawData).digest('hex');
  }
}
