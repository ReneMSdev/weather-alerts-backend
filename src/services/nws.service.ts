// National Weather Service API service for fetching weather data
// NWS API Wrapper
import axios from 'axios'
import { geocodeCity } from './geo.service'

const NWS_API_URL = 'https://api.weather.gov/points'
