import argon2 from 'argon2';

export class PasswordUtil {
  /**
   * Hashes a password using Argon2id
   */
  static async hash(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  }

  /**
   * Verifies a password against a hash
   */
  static async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch (error) {
      return false;
    }
  }
}
