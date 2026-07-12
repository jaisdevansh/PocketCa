import { pgTable, text, varchar, boolean, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';
import { users } from './users';

export const devices = pgTable('devices', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  deviceName: varchar('device_name', { length: 100 }),
  os: varchar('os', { length: 50 }),
  platform: varchar('platform', { length: 50 }),
  manufacturer: varchar('manufacturer', { length: 100 }),
  model: varchar('model', { length: 100 }),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  pushToken: text('push_token'),
  trustedDevice: boolean('trusted_device').default(false),
  securityLevel: varchar('security_level', { length: 20 }),
  deviceFingerprint: text('device_fingerprint').unique().notNull(),
});

export const sessions = pgTable('sessions', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  deviceId: uuid('device_id').references(() => devices.id),
  accessTokenId: text('access_token_id').notNull(),
  refreshTokenId: text('refresh_token_id').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  location: text('location'),
  browser: varchar('browser', { length: 100 }),
  os: varchar('os', { length: 50 }),
  lastActivity: timestamp('last_activity', { withTimezone: true }),
  revoked: boolean('revoked').default(false),
});

export const refreshTokens = pgTable('refresh_tokens', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  tokenHash: text('token_hash').notNull(),
  deviceId: varchar('device_id', { length: 100 }),
  deviceName: varchar('device_name', { length: 100 }),
  browser: varchar('browser', { length: 100 }),
  platform: varchar('platform', { length: 50 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }).defaultNow(),
  revoked: boolean('revoked').default(false),
});

export const verificationTokens = pgTable('verification_tokens', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  tokenHash: text('token_hash').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // EMAIL, PHONE
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  used: boolean('used').default(false),
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  used: boolean('used').default(false),
});

export const loginHistory = pgTable('login_history', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  deviceId: uuid('device_id').references(() => devices.id),
  ipAddress: varchar('ip_address', { length: 45 }),
  country: varchar('country', { length: 2 }),
  browser: varchar('browser', { length: 100 }),
  os: varchar('os', { length: 50 }),
  success: boolean('success').notNull(),
  failureReason: text('failure_reason'),
});

export const roles = pgTable('roles', {
  ...commonColumns,
  name: varchar('name', { length: 50 }).unique().notNull(),
  description: text('description'),
});

export const permissions = pgTable('permissions', {
  ...commonColumns,
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: text('description'),
});

export const rolePermissions = pgTable('role_permissions', {
  ...commonColumns,
  roleId: uuid('role_id').references(() => roles.id).notNull(),
  permissionId: uuid('permission_id').references(() => permissions.id).notNull(),
});

export const userRoles = pgTable('user_roles', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  roleId: uuid('role_id').references(() => roles.id).notNull(),
});

export const securityEvents = pgTable('security_events', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  deviceFingerprint: text('device_fingerprint'),
  metadata: jsonb('metadata'),
});
