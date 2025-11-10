import {
  CurrentWeather,
  DailyForecast,
  WeatherPeriod,
  TransformedWeatherData,
} from '../types/weather'
import { iconFromShortDescription } from './icon.service'

export function transformNwsToWeatherData(
  city: string,
  state: string | undefined,
  coordinates: { lat: number; lng: number },
  periods: WeatherPeriod[]
): TransformedWeatherData {
  if (!periods || periods.length === 0) {
    throw new Error('No periods provided')
  }

  const nowPeriod = periods[0]

  // Current weather
  const current: CurrentWeather = {
    temp: nowPeriod?.temp ?? 0,
    high: periods
      .filter((p) => p?.isDaytime)
      .reduce((max, p) => Math.max(max, p?.temp ?? 0), nowPeriod?.temp ?? 0),
    low: periods
      .filter((p) => p && !p.isDaytime)
      .reduce((min, p) => Math.min(min, p?.temp ?? nowPeriod?.temp ?? 0), nowPeriod?.temp ?? 0),
    precipitation: nowPeriod?.precipitation ?? null,
    windSpeed: nowPeriod?.windSpeed ?? '',
    windDirection: nowPeriod?.windDirection ?? '',
    icon: iconFromShortDescription(nowPeriod?.shortForecast ?? ''),
    shortDescription: nowPeriod?.shortForecast ?? '',
    detailedDescription: nowPeriod?.detailedForecast ?? '',
  }

  // Determine how many periods to skip for forecast
  const startIndex = nowPeriod?.isDaytime ? 2 : 1

  // Build 7-day forecast using reduce
  const dailyForecast: DailyForecast[] = periods
    .slice(startIndex)
    // acc is an accumulator array of daily forecasts
    .reduce((acc: DailyForecast[], p) => {
      if (!p || !p.name) return acc

      const dayName = p.name.replace(/ Night$/, '')
      const existing = acc.find((d) => d.day === dayName)

      if (existing) {
        if (p.isDaytime) existing.high = p.temp
        else existing.low = p.temp
      } else {
        acc.push({
          day: dayName,
          high: p.isDaytime ? p.temp : null,
          low: !p.isDaytime ? p.temp : null,
          description: p.shortForecast ?? '',
          icon: iconFromShortDescription(p.shortForecast ?? ''),
        })
      }

      return acc
    }, [])

  const todayEntry: DailyForecast = {
    day: 'Today',
    high: current.high,
    low: current.low,
    description: current.shortDescription,
    icon: current.icon,
  }

  // Fill in missing high/low with 0 to satisfy types
  const futureForecast = dailyForecast.map((d) => ({
    day: d.day,
    high: d.high ?? 0,
    low: d.low ?? 0,
    icon: d.icon ?? '',
    description: d.description,
  }))

  const finalizedForecast = [todayEntry, ...futureForecast]

  return {
    city,
    state,
    current,
    coordinates,
    forecast: finalizedForecast,
    updatedAt: new Date().toISOString(),
  }
}
