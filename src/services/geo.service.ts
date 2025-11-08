// Geolocation service
// Uses mobile device GPS or IP address to determine location
// Geocoding: Convert latitude/longitude to human-readable address
// Reverse geocoding: Convert address to latitude/longitude
import axios from 'axios'

const GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY as string

export async function geocodeCity(city: string): Promise<{ lat: number; lng: number }> {
  return axios
    .get(GOOGLE_GEOCODE_URL, {
      params: {
        address: city,
        key: GOOGLE_API_KEY,
      },
    })
    .then((response) => {
      const result = response.data.results[0]
      if (!result) {
        throw new Error(`Unable to geocode city ${city}`)
      }
      const { lat, lng } = result.geometry.location
      return { lat, lng }
    })
    .catch((error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Geocoding failed (${error.response.status}):`, error.response.data)
        throw new Error(`Geocoding error: ${error.response.status} - ${error.response.statusText}`)
      } else {
        console.error('Unexpected geocoding error:', error.message || error)
        throw new Error('Geocoding service is currently unavailable.')
      }
    })
}
