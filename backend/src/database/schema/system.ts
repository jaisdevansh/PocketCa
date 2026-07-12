import { pgTable, text, varchar, boolean, jsonb, uuid, timestamp } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';
import { users } from './users';

export const notifications = pgTable('notifications', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // ALERT, INSIGHT, REMINDER
  read: boolean('read').default(false),
  actionUrl: text('action_url'),
  metadata: jsonb('metadata'),
});

export const notificationHistory = pgTable('notification_history', {
  ...commonColumns,
  notificationId: uuid('notification_id').references(() => notifications.id).notNull(),
  status: varchar('status', { length: 50 }), // SENT, FAILED
  deliveryMethod: varchar('delivery_method', { length: 50 }), // PUSH, EMAIL, IN_APP
  errorDetails: text('error_details'),
});

export const auditLogs = pgTable('audit_logs', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }),
  entityId: uuid('entity_id'),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
});

export const activityLogs = pgTable('activity_logs', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  description: text('description'),
  metadata: jsonb('metadata'),
});

export const backgroundJobs = pgTable('background_jobs', {
  ...commonColumns,
  name: varchar('name', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).default('PENDING'), // PENDING, RUNNING, COMPLETED, FAILED
  lockedAt: timestamp('locked_at', { withTimezone: true }),
  lockedBy: varchar('locked_by', { length: 100 }), // Worker ID
  payload: jsonb('payload'),
});

export const queueLogs = pgTable('queue_logs', {
  ...commonColumns,
  jobId: uuid('job_id').references(() => backgroundJobs.id).notNull(),
  status: varchar('status', { length: 50 }),
  errorDetails: text('error_details'),
});

// Part 8 additions
export const jobLogs = pgTable('job_logs', {
  ...commonColumns,
  jobId: varchar('job_id', { length: 100 }).notNull(), // BullMQ Job ID
  queueName: varchar('queue_name', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  result: jsonb('result'),
  error: text('error'),
});

export const workerLogs = pgTable('worker_logs', {
  ...commonColumns,
  workerId: varchar('worker_id', { length: 100 }).notNull(),
  queueName: varchar('queue_name', { length: 100 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(), // STARTED, STOPPED, FAILED
  details: jsonb('details'),
});

export const eventLogs = pgTable('event_logs', {
  ...commonColumns,
  eventName: varchar('event_name', { length: 100 }).notNull(),
  payload: jsonb('payload'),
  emittedBy: varchar('emitted_by', { length: 100 }),
  status: varchar('status', { length: 50 }).default('PROCESSED'),
});

export const cacheMetadata = pgTable('cache_metadata', {
  ...commonColumns,
  cacheKey: varchar('cache_key', { length: 255 }).unique().notNull(),
  cacheType: varchar('cache_type', { length: 100 }), // REDIS
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  tags: jsonb('tags'),
});
// End Part 8 additions

export const featureFlags = pgTable('feature_flags', {
  ...commonColumns,
  key: varchar('key', { length: 100 }).unique().notNull(),
  enabled: boolean('enabled').default(false),
  description: text('description'),
  rules: jsonb('rules'), // E.g., specific user segments
});

export const applicationSettings = pgTable('application_settings', {
  ...commonColumns,
  key: varchar('key', { length: 100 }).unique().notNull(),
  value: text('value').notNull(),
  description: text('description'),
});
