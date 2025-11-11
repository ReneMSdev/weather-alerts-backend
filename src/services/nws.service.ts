// National Weather Service API service for fetching weather data
// NWS API Wrapper
import axios from 'axios'
// import { geocodeCity } from './geo.service'
import { WeatherPeriod, TransformedWeatherData } from '../types/weather'
import { transformNwsToWeatherData } from './transformWeather'
import { getOrCreateLocation } from './location.service'

const NWS_API_URL = 'https://api.weather.gov/points'
const NWS_GRIDPOINTS_API_URL = 'https://api.weather.gov/gridpoints'
const USER_AGENT = `weather-alerts-backend (${process.env.CONTACT_EMAIL})`

// Mock locations for testing
// ---------------------------
// const MOCK_LOCATION = {
//   lat: 39.7392358,
//   lng: -104.990251,
//   city: 'Denver',
//   state: 'TX',
// }
// const MOCK_LOCATION_COLUMBIA = {
//   lat: 38.951561,
//   lng: -92.328636,
//   city: 'Columbia',
//   state: 'MO',
// }
// ---------------------------

// Main function to fetch weather data for a city
export async function fetchWeather(cityName: string): Promise<TransformedWeatherData> {
  // 1. Get or create the location
  const location = await getOrCreateLocation(cityName)

  // 2. Get the forecast URL
  const forecastUrl =
    await `${NWS_GRIDPOINTS_API_URL}/${location.grid_id}/${location.grid_x},${location.grid_y}/forecast`

  // 3. Fetch the forecast data
  const periods = await fetchNwsForecast(forecastUrl)

  // 4. Transform the forecast data
  return transformNwsToWeatherData(
    location.city,
    location.state,
    { lat: Number(location.lat), lng: Number(location.lon) },
    periods
  )
}

// Helper function to get the forecast URL from the NWS points API
export async function getForecastUrlAndGrid(
  lat: number,
  lng: number
): Promise<{ forecastUrl: string; gridId: string; gridX: number; gridY: number }> {
  return axios
    .get(`${NWS_API_URL}/${lat},${lng}`)
    .then((response) => {
      const properties = response.data.properties
      if (!properties) {
        throw new Error('No properties found in NWS response')
      }
      return {
        forecastUrl: properties.forecast,
        gridId: properties.gridId,
        gridX: properties.gridX,
        gridY: properties.gridY,
      }
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
