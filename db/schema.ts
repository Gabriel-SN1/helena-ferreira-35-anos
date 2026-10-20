import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const confirmations = sqliteTable('confirmations', { id:text('id').primaryKey(), name:text('name').notNull(), createdAt:text('created_at').notNull() });
