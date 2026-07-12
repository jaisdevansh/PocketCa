import { pgTable, uuid, varchar, timestamp, pgEnum, decimal, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { commonColumns } from '../utils/common-columns';

export const goalStatusEnum = pgEnum('goal_status', ['ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED']);

export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  targetAmount: decimal('target_amount', { precision: 12, scale: 2 }).notNull(),
  currentAmount: decimal('current_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
  status: goalStatusEnum('status').default('ACTIVE').notNull(),
  deadline: timestamp('deadline', { withTimezone: true, mode: 'string' }),
  icon: varchar('icon', { length: 50 }),
  color: varchar('color', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});

// Relationships
export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

export const goalHistory = pgTable('goal_history', {
  ...commonColumns,
  goalId: uuid('goal_id').references(() => goals.id, { onDelete: 'cascade' }).notNull(),
  amountAdded: decimal('amount_added', { precision: 12, scale: 2 }).notNull(),
  transactionId: uuid('transaction_id'), // can reference transactions.id
  notes: text('notes'),
});
