import { pgTable, text, varchar, decimal, timestamp, uuid, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';
import { users } from './users';
import { merchants } from './merchants';
import { categories, subCategories } from './categories';
import { banks } from './financial';

export const transactions = pgTable('transactions', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  source: varchar('source', { length: 50 }).notNull(), // SMS, EMAIL, MANUAL, API
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  type: varchar('type', { length: 10 }).notNull(), // CREDIT, DEBIT
  merchantId: uuid('merchant_id').references(() => merchants.id),
  categoryId: uuid('category_id').references(() => categories.id),
  subCategoryId: uuid('sub_category_id').references(() => subCategories.id),
  bankId: uuid('bank_id').references(() => banks.id),
  accountLastFourDigits: varchar('account_last_four_digits', { length: 4 }),
  referenceNumber: varchar('reference_number', { length: 100 }),
  balance: decimal('balance', { precision: 15, scale: 2 }),
  transactionDate: timestamp('transaction_date', { withTimezone: true }).notNull(),
  description: text('description'),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  hash: text('hash').unique(),
  rawMetadata: jsonb('raw_metadata'),
  status: varchar('status', { length: 20 }).default('COMPLETED'),
  parserVersion: varchar('parser_version', { length: 50 }),
});

export const transactionAttachments = pgTable('transaction_attachments', {
  ...commonColumns,
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: varchar('file_type', { length: 50 }),
  fileSize: decimal('file_size', { precision: 10, scale: 2 }),
});

export const recurringTransactions = pgTable('recurring_transactions', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  merchantId: uuid('merchant_id').references(() => merchants.id),
  categoryId: uuid('category_id').references(() => categories.id),
  amount: decimal('amount', { precision: 15, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('INR'),
  frequency: varchar('frequency', { length: 20 }), // WEEKLY, MONTHLY, YEARLY
  nextDueDate: timestamp('next_due_date', { withTimezone: true }),
  active: boolean('active').default(true),
});

export const subscriptions = pgTable('subscriptions', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  merchantId: uuid('merchant_id').references(() => merchants.id),
  name: varchar('name', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  billingCycle: varchar('billing_cycle', { length: 20 }), // MONTHLY, YEARLY
  nextBillingDate: timestamp('next_billing_date', { withTimezone: true }),
  status: varchar('status', { length: 20 }).default('ACTIVE'),
});

export const emis = pgTable('emis', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  bankId: uuid('bank_id').references(() => banks.id),
  name: varchar('name', { length: 255 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 15, scale: 2 }),
  emiAmount: decimal('emi_amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  totalMonths: integer('total_months'),
  monthsPaid: integer('months_paid').default(0),
  nextDueDate: timestamp('next_due_date', { withTimezone: true }),
  status: varchar('status', { length: 20 }).default('ACTIVE'),
});

export const subscriptionHistory = pgTable('subscription_history', {
  ...commonColumns,
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id, { onDelete: 'cascade' }).notNull(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  billingDate: timestamp('billing_date', { withTimezone: true }).notNull(),
  amountPaid: decimal('amount_paid', { precision: 15, scale: 2 }).notNull(),
});

export const emiHistory = pgTable('emi_history', {
  ...commonColumns,
  emiId: uuid('emi_id').references(() => emis.id, { onDelete: 'cascade' }).notNull(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  paymentDate: timestamp('payment_date', { withTimezone: true }).notNull(),
  amountPaid: decimal('amount_paid', { precision: 15, scale: 2 }).notNull(),
  principalComponent: decimal('principal_component', { precision: 15, scale: 2 }),
  interestComponent: decimal('interest_component', { precision: 15, scale: 2 }),
});
