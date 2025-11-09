// Raw data from NWS API
export interface WeatherPeriod {
  number: number // 1 is today/tonight
  name: string // "Today"/"Tonight"/"Monday"/"Monday Night"
  isDaytime: boolean
  temp: number
  precipitation: number | null
  windSpeed: string
  windDirection: string
  icon: string
  shortForecast: string
  detailedForecast: string
}

export interface DailyForecast {
  day: string
  high: number | null
  low: number | null
  description: string
  icon: string
}

export interface CurrentWeather {
  temp: number
  high: number | null
  low: number | null
  precipitation: number | null
  windSpeed: string
  windDirection: string
  icon: string
  shortDescription: string
  detailedDescription: string
}

// Weather data for given city (response from NWS API)
export interface TransformedWeatherData {
  city: string
  state: string | undefined
  coordinates: { lat: number; lng: number }
  current: CurrentWeather
  forecast: DailyForecast[]
  updatedAt: string
}
