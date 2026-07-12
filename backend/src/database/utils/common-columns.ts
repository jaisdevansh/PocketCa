import { timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const commonColumns = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  version: integer('version').default(1).notNull(),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
};
