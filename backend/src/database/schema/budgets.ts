import { pgTable, text, varchar, decimal, boolean, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';
import { users } from './users';
import { categories } from './categories';
import { merchants } from './merchants';

export const budgetPeriodEnum = pgEnum('budget_period', ['WEEKLY', 'MONTHLY', 'YEARLY']);

export const budgets = pgTable('budgets', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  merchantId: uuid('merchant_id').references(() => merchants.id),
  name: varchar('name', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  period: budgetPeriodEnum('period').default('MONTHLY').notNull(),
  active: boolean('active').default(true),
  autoReset: boolean('auto_reset').default(true),
  alertsEnabled: boolean('alerts_enabled').default(true),
});

export const budgetHistory = pgTable('budget_history', {
  ...commonColumns,
  budgetId: uuid('budget_id').references(() => budgets.id, { onDelete: 'cascade' }).notNull(),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  amountBudgeted: decimal('amount_budgeted', { precision: 15, scale: 2 }).notNull(),
  amountSpent: decimal('amount_spent', { precision: 15, scale: 2 }).default('0.00'),
  currency: varchar('currency', { length: 3 }).default('INR'),
  exceeded: boolean('exceeded').default(false),
});
