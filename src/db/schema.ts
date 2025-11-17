// Drizzle ORM Schema for PostgreSQL
import { pgTable, serial, varchar, decimal, integer, text, timestamp } from 'drizzle-orm/pg-core'

export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  // Canonical lookup key: "City, ST"
  city_id: varchar('city_id', { length: 100 }).notNull().unique(),

  // Normalized name components
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),

  // Coordinates
  lat: decimal('lat', { precision: 8, scale: 5 }).notNull(),
  lon: decimal('lon', { precision: 8, scale: 5 }).notNull(),

  // NWS grid data
  grid_id: text('grid_id').notNull(),
  grid_x: integer('grid_x').notNull(),
  grid_y: integer('grid_y').notNull(),

  // Timestamps
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const devices = pgTable('devices', {
  id: serial('id').primaryKey(),
  device_id: varchar('device_id', { length: 36 }).notNull().unique(),
  // user_id: varchar('user_id', { length: 36 }).unique(),
  platform: varchar('platform', { length: 10 }),
  os_version: varchar('os_version', { length: 50 }),
  push_token: text('push_token'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})
