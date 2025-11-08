import { Request, Response } from 'express'
import { fetchWeather } from '../services/nws.service'

// Mock controller for fetching weather data by city
export const getWeatherByCityMock = async (req: Request, res: Response) => {
  const { city } = req.params

  // Placeholder logic
  const mockWeatherData: any = {
    city: city ?? 'Unknown',
    current: {
      temp: 75,
      high: 80,
      low: 64,
      description: 'Sunny',
      icon: '☀️',
    },
    forcast: [
      {
        day: 'Monday',
        high: 80,
        low: 64,
        description: 'Sunny',
        icon: '☀️',
      },
      {
        day: 'Tuesday',
        high: 82,
        low: 66,
        description: 'Partly Cloudy',
        icon: '⛅️',
      },
      {
        day: 'Wednesday',
        high: 78,
        low: 62,
        description: 'Cloudy',
        icon: '☁️',
      },
      {
        day: 'Thursday',
        high: 76,
        low: 60,
        description: 'Rainy',
        icon: '🌧️',
      },
      {
        day: 'Friday',
        high: 74,
        low: 58,
        description: 'Snowy',
        icon: '❄️',
      },
      {
        day: 'Saturday',
        high: 72,
        low: 56,
        description: 'Sunny',
        icon: '☀️',
      },
    ],
    updatedAt: new Date().toISOString(),
  }

  res.json(mockWeatherData)
}

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
