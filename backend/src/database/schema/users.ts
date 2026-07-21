import { pgTable, text, varchar, boolean, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';

export const users = pgTable('users', {
  ...commonColumns,
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 20 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique(),
  passwordHash: text('password_hash'),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  profileImage: text('profile_image'),
  country: varchar('country', { length: 2 }),
  timezone: varchar('timezone', { length: 50 }),
  language: varchar('language', { length: 10 }).default('en'),
  currency: varchar('currency', { length: 3 }).default('INR'),
  status: varchar('status', { length: 20 }).default('PENDING'),
  emailVerified: boolean('email_verified').default(false),
  phoneVerified: boolean('phone_verified').default(false),
  lastLogin: timestamp('last_login', { withTimezone: true }),
});

export const userPreferences = pgTable('user_preferences', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  theme: varchar('theme', { length: 20 }).default('system'),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  marketingEmails: boolean('marketing_emails').default(false),
  defaultCurrency: varchar('default_currency', { length: 3 }).default('INR'),
});

export const settings = pgTable('settings', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  biometricEnabled: boolean('biometric_enabled').default(false),
  passkeyEnabled: boolean('passkey_enabled').default(false),
});

export const apiKeys = pgTable('api_keys', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  keyHash: text('key_hash').notNull(),
  name: varchar('name', { length: 100 }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
});
