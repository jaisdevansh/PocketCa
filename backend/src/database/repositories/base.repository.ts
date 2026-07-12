import { db } from '../connection/database';
import { SQL, eq } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { TransactionClient } from '../connection/transaction';

/**
 * Base Repository providing common CRUD operations.
 * Enforces Soft Delete rules implicitly.
 */
export abstract class BaseRepository<TTable extends PgTable> {
  constructor(protected readonly table: TTable) {}

  /**
   * Use this to execute within an existing transaction or the default DB client.
   */
  protected getClient(tx?: TransactionClient) {
    return tx ?? db;
  }
}
