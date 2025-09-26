import type { Config } from 'drizzle-kit'
import process from 'node:process'

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:./database.sqlite',
  },
} satisfies Config
