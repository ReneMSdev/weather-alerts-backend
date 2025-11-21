// Geolocation service
// Uses mobile device GPS or IP address to determine location
// Geocoding: Convert latitude/longitude to human-readable address
// Reverse geocoding: Convert address to latitude/longitude
import axios from 'axios'

const GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
const GOOGLE_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY as string

export interface GeocodeResult {
  lat: number
  lng: number
  city: string
  state: string
  placeId: string
}

export async function geocodeCity(cityName: string): Promise<GeocodeResult> {
  return axios
    .get(GOOGLE_GEOCODE_URL, {
      params: {
        address: cityName,
        key: GOOGLE_API_KEY,
      },
    })
    .then((response) => {
      const result = response.data.results[0]
      if (!result) {
        throw new Error(`Unable to geocode city ${cityName}`)
      }

      const components = result.address_components

      const city =
        components.find((c: any) => c.types.includes('locality'))?.long_name ||
        components.find((c: any) => c.types.includes('postal_town'))?.long_name ||
        cityName // fallback

      const state =
        components.find((c: any) => c.types.includes('administrative_area_level_1'))?.short_name ||
        ''

      const { lat, lng } = result.geometry.location
      const placeId = result.place_id

      return { lat, lng, city, state, placeId }
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
