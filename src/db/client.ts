import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

// create a PostgreSQl connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

// create a Drizzle client
export const db = drizzle(pool)
