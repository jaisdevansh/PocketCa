import { eq, and } from 'drizzle-orm';
import { BaseRepository } from '../../../database/repositories/base.repository';
import { refreshTokens, verificationTokens } from '../../../database/schema/auth';
import { TransactionClient } from '../../../database/connection/transaction';

export class TokenRepository extends BaseRepository<typeof refreshTokens> {
  constructor() {
    super(refreshTokens);
  }

  async storeRefreshToken(data: typeof refreshTokens.$inferInsert, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .insert(refreshTokens)
      .values(data)
      .returning();
    return result[0];
  }

  async findRefreshToken(tokenHash: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);
    return result[0] || null;
  }

  async revokeRefreshToken(tokenHash: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    await client
      .update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.tokenHash, tokenHash));
  }

  async revokeAllUserRefreshTokens(userId: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    await client
      .update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.userId, userId));
  }

  async storeVerificationToken(data: typeof verificationTokens.$inferInsert, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .insert(verificationTokens)
      .values(data)
      .returning();
    return result[0];
  }

  async markVerificationTokenUsed(tokenHash: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    await client
      .update(verificationTokens)
      .set({ used: true })
      .where(eq(verificationTokens.tokenHash, tokenHash));
  }
}

export const tokenRepository = new TokenRepository();
