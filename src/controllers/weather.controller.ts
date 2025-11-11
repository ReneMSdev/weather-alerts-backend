import { Request, Response } from 'express'
import { fetchWeather } from '../services/nws.service'

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
