import crypto from 'crypto';

export class TokenUtil {
  /**
   * Generates a secure random hexadecimal token
   */
  static generateRandomToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }

  /**
   * Hashes a token using SHA-256 for secure database storage
   * (e.g. refresh tokens, verification tokens)
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a secure 6-digit OTP
   */
  static generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}
