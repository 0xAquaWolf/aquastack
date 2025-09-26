import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export const quests = sqliteTable('quests', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status', { enum: ['pending', 'in_progress', 'completed'] }).notNull().default('pending'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Quest = typeof quests.$inferSelect
export type NewQuest = typeof quests.$inferInsert
