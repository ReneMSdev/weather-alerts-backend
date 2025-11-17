import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // NOTE: Currently disabling certificate verification for convenience with Render Postgres.
    // Consider enabling full verification (rejectUnauthorized: true) in production for better security.
    ssl: { rejectUnauthorized: false },
  },
  migrations: {
    table: '__drizzle_migrations',
    schema: 'public',
  },
})
