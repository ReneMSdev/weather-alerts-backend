// src/controllers/device.controller.ts
// Controller for device registration and management
import { Request, Response } from 'express'
import { db } from '../db/client'
import { devices, devices_to_locations, locations } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { getOrCreateLocation, getLocation, LocationRecord } from '../services/location.service'

// Register or return existing device
export const registerDevice = async (req: Request, res: Response) => {
  try {
    const { deviceId, platform, osVersion, pushToken } = req.body

    if (!deviceId) return res.status(400).json({ error: 'Device ID is required' })

    // Check if device already exists
    const existing = await db.select().from(devices).where(eq(devices.device_id, deviceId))

    if (existing.length > 0) {
      // Device already registered, return existing device, but not created
      return res.json({ device: existing[0], created: false })
    }

    // Insert new device
    const inserted = await db
      .insert(devices)
      .values({
        device_id: deviceId,
        platform,
        os_version: osVersion,
        push_token: pushToken,
      })
      .returning()

    res.json({ device: inserted[0], created: true })
  } catch (error: any) {
    console.error('Error registering device:', error)
    res.status(500).json({ error: 'Faied to register device' })
  }
}

// Add location to a device
export const addDeviceLocation = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params
    const { cityId } = req.body

    if (!deviceId) return res.status(400).json({ error: 'Device ID is required' })
    if (!cityId) return res.status(400).json({ error: 'City ID is required' })

    // Fetch device
    const deviceResult = await db.select().from(devices).where(eq(devices.device_id, deviceId))
    const device = deviceResult[0]
    if (!device) return res.status(404).json({ error: 'Device not found' })

    // Get or create location
    const location: LocationRecord = await getOrCreateLocation(cityId)

    // Insert into devices_to_locations
    try {
      await db.insert(devices_to_locations).values({
        device_id_fk: device.id,
        location_id_fk: location.id,
      })
    } catch (error: any) {
      // Ignore duplicate key error
      if (!error.message.includes('duplicate key')) {
        throw error
      }
    }

    // Return result
    res.json({ device, location })
  } catch (error: any) {
    console.error('Error adding location to device:', error)
    res.status(500).json({ error: 'Failed to add location to device.' })
  }
}

// Remove location from a device
export const removeDeviceLocation = async (req: Request, res: Response) => {
  try {
    const { deviceId, cityId } = req.params

    if (!deviceId) return res.status(400).json({ error: 'Device ID is required' })
    if (!cityId) return res.status(400).json({ error: 'City ID is required' })

    //  Fetch device
    const deviceResult = await db.select().from(devices).where(eq(devices.device_id, deviceId))
    const device = deviceResult[0]
    if (!device) return res.status(404).json({ error: 'Device not found' })

    // Fetch location
    const location: LocationRecord | null = await getLocation(cityId)
    if (!location) return res.status(404).json({ error: 'Location not found.' })

    // Delete row from devices_to_locations
    await db
      .delete(devices_to_locations)
      .where(
        and(
          eq(devices_to_locations.device_id_fk, device.id),
          eq(devices_to_locations.location_id_fk, location.id)
        )
      )

    res.sendStatus(204)
  } catch (error: any) {
    console.error('Error removing location from device:', error)
    res.status(500).json({ error: 'Failed to remove location from device.' })
  }
}

// Get list of locations for a device
export const getDeviceLocations = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params
    if (!deviceId) return res.status(400).json({ error: 'Device ID is required' })

    // Fetch device
    const deviceResult = await db.select().from(devices).where(eq(devices.device_id, deviceId))
    const device = deviceResult[0]
    if (!device) return res.status(404).json({ error: 'Device not found' })

    // Fetch all locations for device
    const locationRows = await db
      .select({
        city_id: locations.city_id,
        city: locations.city,
        state: locations.state,
        lat: locations.lat,
        lon: locations.lon,
        timezone: locations.timezone,
      })
      .from(devices_to_locations)
      .innerJoin(locations, eq(devices_to_locations.location_id_fk, locations.id))
      .where(eq(devices_to_locations.device_id_fk, device.id))

    res.json({ locations: locationRows })
  } catch (error: any) {
    console.error('Error fetching device locations:', error)
    res.status(500).json({ error: 'Failed to fetch device locations.' })
  }
}
