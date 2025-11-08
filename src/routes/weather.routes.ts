// Weather routes for fetching and managing weather data
import { Router } from 'express'
import { getWeatherByCity } from '../controllers/weather.controller'

const router = Router()

router.get('/:city', getWeatherByCity)

export default router
