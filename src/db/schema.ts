// Drizzle ORM Schema for PostgreSQL
import { pgTable, serial, varchar, decimal, integer, text, timestamp } from 'drizzle-orm/pg-core'

export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  city_name: varchar('city_name', { length: 100 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  lat: decimal('lat', { precision: 8, scale: 5 }).notNull(),
  lon: decimal('lon', { precision: 8, scale: 5 }).notNull(),
  grid_id: text('grid_id').notNull(),
  grid_x: integer('grid_x').notNull(),
  grid_y: integer('grid_y').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})
