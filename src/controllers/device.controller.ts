// src/controllers/device.controller.ts
// Controller for device registration and management
import { Request, Response } from 'express'
import { db } from '../db/client'
import { devices, devices_to_locations } from '../db/schema'
import { eq } from 'drizzle-orm'
import { getOrCreateLocation, LocationRecord } from '../services/location.service'

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
