import { sql } from 'drizzle-orm';
import { db } from './database';

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    return false;
  }
}
