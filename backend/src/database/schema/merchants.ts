import { pgTable, text, varchar, integer, uuid, decimal } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';
import { categories } from './categories';

export const merchants = pgTable('merchants', {
  ...commonColumns,
  displayName: varchar('display_name', { length: 255 }).notNull(),
  normalizedName: varchar('normalized_name', { length: 255 }).unique().notNull(),
  website: text('website'),
  logoUrl: text('logo_url'),
  categoryId: uuid('category_id').references(() => categories.id),
  popularityScore: integer('popularity_score').default(0),
  verificationStatus: varchar('verification_status', { length: 50 }).default('UNVERIFIED'),
  country: varchar('country', { length: 2 }),
  state: varchar('state', { length: 100 }),
  city: varchar('city', { length: 100 }),
});

export const merchantAliases = pgTable('merchant_aliases', {
  ...commonColumns,
  merchantId: uuid('merchant_id').references(() => merchants.id).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  normalizedName: varchar('normalized_name', { length: 255 }).notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  parserVersion: varchar('parser_version', { length: 50 }),
});

export const unknownMerchants = pgTable('unknown_merchants', {
  ...commonColumns,
  rawName: text('raw_name').notNull(),
  occurrences: integer('occurrences').default(1),
  firstSeenAt: commonColumns.createdAt,
  lastSeenAt: commonColumns.createdAt,
});
