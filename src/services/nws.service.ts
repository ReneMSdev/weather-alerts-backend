// National Weather Service API service for fetching weather data
// NWS API Wrapper
import axios from 'axios'
// import { geocodeCity } from './geo.service'
import { WeatherPeriod, TransformedWeatherData } from '../types/weather'
import { transformNwsToWeatherData } from './transformWeather'

const NWS_API_URL = 'https://api.weather.gov/points'
const USER_AGENT = `weather-alerts-backend (${process.env.CONTACT_EMAIL})`

// Mock locations for testing
// ---------------------------
// const MOCK_LOCATION = {
//   lat: 39.7392358,
//   lng: -104.990251,
//   city: 'Denver',
//   state: 'TX',
// }
const MOCK_LOCATION_COLUMBIA = {
  lat: 38.951561,
  lng: -92.328636,
  city: 'Columbia',
  state: 'MO',
}
// ---------------------------

// Main function to fetch weather data for a city
export async function fetchWeather(cityName: string): Promise<TransformedWeatherData> {
  // ✅ Use real geocoding OR mock location
  // const { lat, lng, city, state } = await geocodeCity(cityName)
  const { lat, lng, city, state } = MOCK_LOCATION_COLUMBIA

  const forecastUrl = await getForecastUrl(lat, lng)
  const periods = await fetchNwsForecast(forecastUrl)

  return transformNwsToWeatherData(city, state, { lat, lng }, periods)
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
