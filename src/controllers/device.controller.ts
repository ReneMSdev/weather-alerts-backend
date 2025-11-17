import { Request, Response } from 'express'
import { db } from '../db/client'
import { devices } from '../db/schema'
import { eq } from 'drizzle-orm'

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
