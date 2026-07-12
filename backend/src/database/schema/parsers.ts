import { pgTable, text, varchar, integer, uuid, boolean, decimal, jsonb } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';
import { users } from './users';

export const smsLogs = pgTable('sms_logs', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  hash: text('hash').unique().notNull(), // Hash of SMS to avoid processing duplicates
  sender: varchar('sender', { length: 255 }).notNull(),
  rawContent: text('raw_content').notNull(),
  parserVersion: varchar('parser_version', { length: 50 }),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 50 }).default('PENDING'), // PENDING, PROCESSED, FAILED, IGNORED, DUPLICATE
  processed: boolean('processed').default(false),
  retryCount: integer('retry_count').default(0),
});

export const smsParserLogs = pgTable('sms_parser_logs', {
  ...commonColumns,
  smsId: uuid('sms_id').references(() => smsLogs.id).notNull(),
  rawTextLength: integer('raw_text_length'),
  executionTimeMs: integer('execution_time_ms'),
  errorDetails: text('error_details'),
});

export const smsFailures = pgTable('sms_failures', {
  ...commonColumns,
  smsId: uuid('sms_id').references(() => smsLogs.id).notNull(),
  reason: text('reason'),
  parserVersion: varchar('parser_version', { length: 50 }),
  resolved: boolean('resolved').default(false),
});

export const smsUnknown = pgTable('sms_unknown', {
  ...commonColumns,
  smsId: uuid('sms_id').references(() => smsLogs.id).notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  reason: text('reason'), // E.g., Unknown merchant, low confidence extraction
  manualReviewRequired: boolean('manual_review_required').default(true),
});

export const smsDuplicate = pgTable('sms_duplicate', {
  ...commonColumns,
  smsId: uuid('sms_id').references(() => smsLogs.id).notNull(),
  duplicateOf: uuid('duplicate_of').references(() => smsLogs.id).notNull(),
  similarityScore: decimal('similarity_score', { precision: 5, scale: 2 }),
});

export const parserVersions = pgTable('parser_versions', {
  ...commonColumns,
  version: varchar('version', { length: 50 }).unique().notNull(),
  description: text('description'),
  active: boolean('active').default(true),
});

export const bankTemplates = pgTable('bank_templates', {
  ...commonColumns,
  bankName: varchar('bank_name', { length: 100 }).notNull(),
  senderRegex: text('sender_regex').notNull(),
  active: boolean('active').default(true),
});

export const regexVersions = pgTable('regex_versions', {
  ...commonColumns,
  bankTemplateId: uuid('bank_template_id').references(() => bankTemplates.id).notNull(),
  version: varchar('version', { length: 50 }).notNull(),
  pattern: text('pattern').notNull(),
  description: text('description'),
  active: boolean('active').default(true),
});

// Existing Email Tables untouched
export const emailConnections = pgTable('email_connections', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // GMAIL, OUTLOOK
  emailAddress: varchar('email_address', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: commonColumns.createdAt,
  status: varchar('status', { length: 50 }).default('ACTIVE'),
});

export const emailLogs = pgTable('email_logs', {
  ...commonColumns,
  connectionId: uuid('connection_id').references(() => emailConnections.id).notNull(),
  messageId: varchar('message_id', { length: 255 }).notNull(),
  threadId: varchar('thread_id', { length: 255 }),
  sender: varchar('sender', { length: 255 }),
  subject: text('subject'),
  hash: text('hash').unique().notNull(),
  processed: boolean('processed').default(false),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  retryCount: integer('retry_count').default(0),
});

export const parserFailures = pgTable('parser_failures', {
  ...commonColumns,
  sourceId: uuid('source_id').notNull(), // Could be SMS ID or Email ID
  sourceType: varchar('source_type', { length: 50 }).notNull(), // SMS, EMAIL
  reason: text('reason'),
  rawPayload: text('raw_payload'), // Strip sensitive details before storing
  resolved: boolean('resolved').default(false),
});

export const gmailSyncLogs = pgTable('gmail_sync_logs', {
  ...commonColumns,
  connectionId: uuid('connection_id').references(() => emailConnections.id).notNull(),
  syncType: varchar('sync_type', { length: 50 }).notNull(), // INITIAL, INCREMENTAL
  historyId: varchar('history_id', { length: 255 }),
  status: varchar('status', { length: 50 }).default('COMPLETED'),
  messagesFetched: integer('messages_fetched').default(0),
  errorDetails: text('error_details'),
});

export const providerTemplates = pgTable('provider_templates', {
  ...commonColumns,
  providerName: varchar('provider_name', { length: 100 }).notNull(),
  active: boolean('active').default(true),
});

export const providerAliases = pgTable('provider_aliases', {
  ...commonColumns,
  providerTemplateId: uuid('provider_template_id').references(() => providerTemplates.id).notNull(),
  senderEmail: varchar('sender_email', { length: 255 }).notNull(),
});

export const emailAttachments = pgTable('email_attachments', {
  ...commonColumns,
  emailLogId: uuid('email_log_id').references(() => emailLogs.id).notNull(),
  fileName: varchar('file_name', { length: 255 }),
  mimeType: varchar('mime_type', { length: 255 }),
  s3Key: varchar('s3_key', { length: 255 }),
  parsed: boolean('parsed').default(false),
});

export const statementMetadata = pgTable('statement_metadata', {
  ...commonColumns,
  attachmentId: uuid('attachment_id').references(() => emailAttachments.id).notNull(),
  statementType: varchar('statement_type', { length: 50 }),
  statementPeriodStart: commonColumns.createdAt,
  statementPeriodEnd: commonColumns.createdAt,
  dueDate: commonColumns.createdAt,
  totalAmountDue: decimal('total_amount_due', { precision: 12, scale: 2 }),
  minimumAmountDue: decimal('minimum_amount_due', { precision: 12, scale: 2 }),
});

export const emailParserLogs = pgTable('email_parser_logs', {
  ...commonColumns,
  emailLogId: uuid('email_log_id').references(() => emailLogs.id).notNull(),
  rawHtmlLength: integer('raw_html_length'),
  rawTextLength: integer('raw_text_length'),
  executionTimeMs: integer('execution_time_ms'),
  errorDetails: text('error_details'),
});

export const emailFailures = pgTable('email_failures', {
  ...commonColumns,
  emailLogId: uuid('email_log_id').references(() => emailLogs.id).notNull(),
  reason: text('reason'),
  parserVersion: varchar('parser_version', { length: 50 }),
  resolved: boolean('resolved').default(false),
});

export const emailUnknown = pgTable('email_unknown', {
  ...commonColumns,
  emailLogId: uuid('email_log_id').references(() => emailLogs.id).notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  reason: text('reason'),
  manualReviewRequired: boolean('manual_review_required').default(true),
});
