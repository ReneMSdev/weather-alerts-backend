import { Request, Response } from 'express'
import { fetchWeather } from '../services/nws.service'
import { db } from '../db/client'
import { eq } from 'drizzle-orm'
import { devices_to_locations, devices, locations } from '../db/schema'

export const getWeatherByCity = async (req: Request, res: Response) => {
  try {
    const { city } = req.params
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' })
    }
    const weatherData = await fetchWeather(city)
    res.json(weatherData)
  } catch (error: any) {
    console.error('Error fetching weather data:', error.message)
    res.status(500).json({ error: error.message || 'Failed to fetch weather data' })
  }
}

export const getWeatherForDevice = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params
    if (!deviceId) return res.status(400).json({ error: 'Device ID is required' })

    // Fetch device
    const deviceResult = await db.select().from(devices).where(eq(devices.device_id, deviceId))
    const device = deviceResult[0]
    if (!device) return res.status(404).json({ error: 'Device not found' })

    // Fetch all locations linked to device
    const linkedLocations = await db
      .select({
        city_id: locations.city_id,
      })
      .from(devices_to_locations)
      .innerJoin(locations, eq(locations.id, devices_to_locations.location_id_fk))
      .where(eq(devices_to_locations.device_id_fk, device.id))

    if (linkedLocations.length === 0) return res.json({ weather: [] })

    // Fetch weather for all locations in parallel
    const weatherData = await Promise.all(linkedLocations.map((loc) => fetchWeather(loc.city_id)))

    res.json({ weather: weatherData })
  } catch (error: any) {
    console.error('Error fetching weather for device:', error)
    res.status(500).json({ error: 'Failed to fetch weather.' })
  }
}
