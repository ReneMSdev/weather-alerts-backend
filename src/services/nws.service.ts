// National Weather Service API service for fetching weather data
// NWS API Wrapper
import axios from 'axios'
// import { geocodeCity } from './geo.service'

const NWS_API_URL = 'https://api.weather.gov/points'
const USER_AGENT = `weather-alerts-backend (${process.env.CONTACT_EMAIL})`

// Mock location for testing
const MOCK_LOCATION = {
  lat: 39.7392358,
  lng: -104.990251,
  city: 'Denver',
  state: 'TX',
}

export interface WeatherPeriod {
  number: number // 1 is today/tonight
  name: string // "Today"/"Tonight"/"Monday"/"Monday Night"
  isDaytime: boolean
  temp: number
  tempUnit: string // "F"
  precipitation: number | null
  windSpeed: string
  windDirection: string
  icon: string
  shortForecast: string
  detailedForecast: string
}

export interface WeatherData {
  city: string
  state: string
  coordinates: { lat: number; lng: number }
  forecastUrl: string
  periods: WeatherPeriod[]
}

// Main function to fetch weather data for a city
export async function fetchWeather(cityName: string): Promise<WeatherData> {
  // Real geolocation service
  // const { lat, lng, city, state } = await geocodeCity(cityName)
  // Mock geolocation service
  const { lat, lng, city, state } = MOCK_LOCATION

  const forecastUrl = await getForecastUrl(lat, lng)
  const periods = await fetchNwsForecast(forecastUrl)

  return {
    city,
    state,
    coordinates: { lat, lng },
    forecastUrl,
    periods,
  }
}

// Helper function to get the forecast URL from the NWS API
async function getForecastUrl(lat: number, lng: number): Promise<string> {
  return axios
    .get(`${NWS_API_URL}/${lat},${lng}`)
    .then((response) => {
      const properties = response.data.properties
      if (!properties) {
        throw new Error('No properties found in NWS response')
      }
      const forecastURL = properties.forecast
      return forecastURL
    })
    .catch((error) => {
      console.error('Error fetching forecast URL:', error.message)
      throw new Error('Failed to fetch forecast URL from NWS')
    })
}

// Helper function to fetch weather data from the NWS API
async function fetchNwsForecast(forecastUrl: string): Promise<WeatherPeriod[]> {
  return axios
    .get(forecastUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    })
    .then((response) => {
      const periods = response.data.properties.periods

      return periods.map((p: any) => ({
        number: p.number,
        name: p.name,
        isDaytime: p.isDaytime,
        temp: p.temperature,
        tempUnit: p.temperatureUnit,
        precipitation: p.probabilityOfPrecipitation?.value ?? null,
        windSpeed: p.windSpeed,
        windDirection: p.windDirection,
        icon: p.icon,
        shortForecast: p.shortForecast,
        detailedForecast: p.detailedForecast,
      })) as WeatherPeriod[]
    })
    .catch((error) => {
      console.error('Error fetching NWS forecast:', error.message)
      throw new Error('Failed to fetch weather data from NWS')
    })
}
