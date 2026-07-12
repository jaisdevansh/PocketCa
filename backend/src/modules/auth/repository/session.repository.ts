import { eq, and } from 'drizzle-orm';
import { BaseRepository } from '../../../database/repositories/base.repository';
import { sessions, devices, loginHistory } from '../../../database/schema/auth';
import { TransactionClient } from '../../../database/connection/transaction';

export class SessionRepository extends BaseRepository<typeof sessions> {
  constructor() {
    super(sessions);
  }

  async findDeviceByFingerprint(fingerprint: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .select()
      .from(devices)
      .where(eq(devices.deviceFingerprint, fingerprint))
      .limit(1);
    return result[0] || null;
  }

  async createDevice(data: typeof devices.$inferInsert, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .insert(devices)
      .values(data)
      .returning();
    return result[0];
  }

  async createSession(data: typeof sessions.$inferInsert, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .insert(sessions)
      .values(data)
      .returning();
    return result[0];
  }

  async revokeSession(sessionId: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    await client
      .update(sessions)
      .set({ revoked: true })
      .where(eq(sessions.id, sessionId));
  }

  async revokeAllUserSessions(userId: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    await client
      .update(sessions)
      .set({ revoked: true })
      .where(eq(sessions.userId, userId));
  }

  async logLoginHistory(data: typeof loginHistory.$inferInsert, tx?: TransactionClient) {
    const client = this.getClient(tx);
    await client.insert(loginHistory).values(data);
  }
}

export const sessionRepository = new SessionRepository();
