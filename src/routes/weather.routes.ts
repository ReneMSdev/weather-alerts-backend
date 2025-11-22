// Weather routes for fetching and managing weather data
import { Router } from 'express'
import { getWeatherByCity, getWeatherForDevice } from '../controllers/weather.controller'

const router = Router()

// Single city weather
router.get('/:city', getWeatherByCity)

// All weather from cities linked to a device
router.get('/devices/:deviceId', getWeatherForDevice)

export default router
