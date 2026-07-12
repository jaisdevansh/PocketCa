import { pgTable, text, varchar, boolean, jsonb, uuid, decimal, timestamp } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';
import { users } from './users';

export const aiInsights = pgTable('ai_insights', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 100 }).notNull(), // SPENDING_ANOMALY, SAVING_OPPORTUNITY, UPCOMING_BILL
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }),
  actionable: boolean('actionable').default(false),
  actionUrl: text('action_url'),
  metadata: jsonb('metadata'),
  dismissed: boolean('dismissed').default(false),
  applied: boolean('applied').default(false),
});

// Part 8 AI Tables
export const aiRequests = pgTable('ai_requests', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  provider: varchar('provider', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  promptId: uuid('prompt_id'),
  tokensUsed: decimal('tokens_used', { precision: 10, scale: 0 }),
  latencyMs: decimal('latency_ms', { precision: 10, scale: 0 }),
  status: varchar('status', { length: 50 }).default('PENDING'),
  errorMessage: text('error_message'),
});

export const aiResponses = pgTable('ai_responses', {
  ...commonColumns,
  requestId: uuid('request_id').references(() => aiRequests.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  structuredData: jsonb('structured_data'),
  validationPassed: boolean('validation_passed').default(true),
  hallucinationScore: decimal('hallucination_score', { precision: 5, scale: 2 }),
});

export const aiPrompts = pgTable('ai_prompts', {
  ...commonColumns,
  name: varchar('name', { length: 100 }).unique().notNull(),
  version: varchar('version', { length: 50 }).notNull(),
  content: text('content').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
});

export const aiTemplates = pgTable('ai_templates', {
  ...commonColumns,
  promptId: uuid('prompt_id').references(() => aiPrompts.id).notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  defaultValue: text('default_value'),
});

export const predictions = pgTable('predictions', {
  ...commonColumns,
  userId: uuid('user_id').references(() => users.id).notNull(),
  predictionType: varchar('prediction_type', { length: 100 }).notNull(), // CASH_FLOW, BUDGET
  targetDate: timestamp('target_date', { withTimezone: true }).notNull(),
  predictedValue: decimal('predicted_value', { precision: 15, scale: 2 }),
  lowerBound: decimal('lower_bound', { precision: 15, scale: 2 }),
  upperBound: decimal('upper_bound', { precision: 15, scale: 2 }),
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }),
  modelUsed: varchar('model_used', { length: 100 }),
});
