import { Request, Response } from 'express'

export const getWeatherByCity = async (req: Request, res: Response) => {
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
