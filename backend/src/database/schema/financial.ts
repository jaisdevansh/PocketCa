import { pgTable, text, varchar, boolean, uuid, decimal, timestamp } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';
import { users } from './users';
import { categories } from './categories';

export const banks = pgTable('banks', {
  ...commonColumns,
  name: varchar('name', { length: 100 }).notNull(),
  logoUrl: text('logo_url'),
  country: varchar('country', { length: 2 }),
  website: text('website'),
});



export const savings = pgTable('savings', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  bankId: uuid('bank_id').references(() => banks.id),
  accountName: varchar('account_name', { length: 255 }),
  balance: decimal('balance', { precision: 15, scale: 2 }).default('0'),
  currency: varchar('currency', { length: 3 }).default('INR'),
  interestRate: decimal('interest_rate', { precision: 5, scale: 2 }),
});

export const investments = pgTable('investments', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }), // STOCKS, MUTUAL_FUNDS, CRYPTO, REAL_ESTATE
  name: varchar('name', { length: 255 }).notNull(),
  investedAmount: decimal('invested_amount', { precision: 15, scale: 2 }).default('0'),
  currentValue: decimal('current_value', { precision: 15, scale: 2 }).default('0'),
  currency: varchar('currency', { length: 3 }).default('INR'),
});

export const emergencyFunds = pgTable('emergency_funds', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  targetAmount: decimal('target_amount', { precision: 15, scale: 2 }).notNull(),
  currentAmount: decimal('current_amount', { precision: 15, scale: 2 }).default('0'),
  currency: varchar('currency', { length: 3 }).default('INR'),
});
