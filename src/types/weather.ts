// Daily forcast
export interface DailyForecast {
  day: string
  high: number
  low: number
  description: string
  icon: string
}

// Current weather
export interface CurrentWeather {
  temp: number
  high: number
  low: number
  description: string
  icon: string
}

// Master response object
export interface WeatherData {
  city: string
  current: CurrentWeather
  forcast: DailyForecast[]
  updatedAt: string
}
