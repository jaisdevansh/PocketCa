import { pgTable, decimal, varchar, uuid, date, integer } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';
import { users } from './users';
import { categories } from './categories';
import { merchants } from './merchants';

export const dailyStatistics = pgTable('daily_statistics', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  statDate: date('stat_date').notNull(),
  totalIncome: decimal('total_income', { precision: 15, scale: 2 }).default('0.00'),
  totalExpense: decimal('total_expense', { precision: 15, scale: 2 }).default('0.00'),
  transactionCount: integer('transaction_count').default(0),
  currency: varchar('currency', { length: 3 }).default('INR'),
});

export const monthlyStatistics = pgTable('monthly_statistics', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  statMonth: varchar('stat_month', { length: 7 }).notNull(), // Format: YYYY-MM
  totalIncome: decimal('total_income', { precision: 15, scale: 2 }).default('0.00'),
  totalExpense: decimal('total_expense', { precision: 15, scale: 2 }).default('0.00'),
  transactionCount: integer('transaction_count').default(0),
  currency: varchar('currency', { length: 3 }).default('INR'),
});

export const yearlyStatistics = pgTable('yearly_statistics', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  statYear: varchar('stat_year', { length: 4 }).notNull(), // Format: YYYY
  totalIncome: decimal('total_income', { precision: 15, scale: 2 }).default('0.00'),
  totalExpense: decimal('total_expense', { precision: 15, scale: 2 }).default('0.00'),
  transactionCount: integer('transaction_count').default(0),
  currency: varchar('currency', { length: 3 }).default('INR'),
});

// Category level analytics
export const categoryMonthlyStatistics = pgTable('category_monthly_statistics', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  statMonth: varchar('stat_month', { length: 7 }).notNull(),
  totalSpent: decimal('total_spent', { precision: 15, scale: 2 }).default('0.00'),
});

// Merchant level analytics
export const merchantMonthlyStatistics = pgTable('merchant_monthly_statistics', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  merchantId: uuid('merchant_id').references(() => merchants.id).notNull(),
  statMonth: varchar('stat_month', { length: 7 }).notNull(),
  totalSpent: decimal('total_spent', { precision: 15, scale: 2 }).default('0.00'),
});
