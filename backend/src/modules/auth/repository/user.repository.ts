import { eq } from 'drizzle-orm';
import { BaseRepository } from '../../../database/repositories/base.repository';
import { users } from '../../../database/schema/users';
import { TransactionClient } from '../../../database/connection/transaction';

export class UserRepository extends BaseRepository<typeof users> {
  constructor() {
    super(users);
  }

  async findByEmail(email: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] || null;
  }

  async findByPhone(phone: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);
    return result[0] || null;
  }

  async findById(id: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] || null;
  }

  async create(data: typeof users.$inferInsert, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .insert(users)
      .values(data)
      .returning();
    return result[0];
  }

  async updateUser(id: string, data: Partial<typeof users.$inferInsert>, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async updateLastLogin(id: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    await client
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, id));
  }
}

export const userRepository = new UserRepository();
