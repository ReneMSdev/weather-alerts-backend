import { db } from '../db/client'
import { locations } from '../db/schema'
import { eq } from 'drizzle-orm'

import { geocodeCity } from './geo.service'
import { getForecastUrlAndGrid } from './nws.service'

// Normalized type for return value
export interface LocationRecord {
  id: number
  city_id: string
  city: string
  state: string
  lat: string
  lon: string
  grid_id: string
  grid_x: number
  grid_y: number
  created_at: string
}

/**
 * Normalize the cityId string from frontend.
 * Expected form: "Austin, TX"
 */
export function normalizeCityId(raw: string): string {
  if (!raw) throw new Error('City name is required')

  return raw
    .trim()
    .replace(/\s*,\s*/g, ', ') // enforce "City, ST" spacing
    .replace(/\s+/g, ' ') // collapse extra spaces
}

/**
 * Fetch a location from the DB by city_id
 */
export async function findLocation(cityId: string): Promise<LocationRecord | null> {
  const result = await db.select().from(locations).where(eq(locations.city_id, cityId))
  if (!result[0]) return null

  const location = result[0]
  return {
    ...location,
    created_at: location.created_at.toISOString(),
  }
}

/**
 * Insert a fully derived location into DB
 */
export async function insertLocation(data: {
  city_id: string
  city: string
  state: string
  lat: string
  lon: string
  grid_id: string
  grid_x: number
  grid_y: number
}): Promise<LocationRecord> {
  const inserted = await db.insert(locations).values(data).returning()
  if (!inserted[0]) throw new Error('Failed to insert location')

  return {
    ...inserted[0],
    created_at: inserted[0].created_at.toISOString(),
  }
}

/**
 * Main resolver for locations.
 */
export async function getOrCreateLocation(rawCityId: string): Promise<LocationRecord> {
  const cityId = normalizeCityId(rawCityId)

  // Step 1: Check existing record
  const existing = await findLocation(cityId)
  if (existing) {
    console.log('Location already exists, returning existing record')
    return existing
  }

  // Step 2: Geocode to get lat, lon, city, state
  const { lat, lng: lon, city, state } = await geocodeCity(cityId)

  console.log('Geocoded location, fetching NWS grid office info')

  // Step 3: Fetch NWS grid office info
  const { gridId, gridX, gridY } = await getForecastUrlAndGrid(lat, lon)

  console.log('Inserting location into database')

  // Step 4: Insert and return
  return await insertLocation({
    city_id: cityId,
    city,
    state,
    lat: lat.toString(),
    lon: lon.toString(),
    grid_id: gridId,
    grid_x: gridX,
    grid_y: gridY,
  })
}
