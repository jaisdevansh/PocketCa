import { pgTable, text, varchar, boolean, integer, uuid } from 'drizzle-orm/pg-core';
import { commonColumns } from '../utils/common-columns';

export const categories = pgTable('categories', {
  ...commonColumns,
  name: varchar('name', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  color: varchar('color', { length: 50 }),
  description: text('description'),
  systemCategory: boolean('system_category').default(false),
  active: boolean('active').default(true),
  order: integer('order').default(0),
});

export const subCategories = pgTable('sub_categories', {
  ...commonColumns,
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  order: integer('order').default(0),
});
