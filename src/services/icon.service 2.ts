const SHORT_DESC_ICON_MAP: Record<string, string> = {
  'mostly sunny': '🌤️',
  'partly sunny': '⛅',
  'partly cloudy': '⛅',
  'mostly cloudy': '🌥️',
  cloudy: '☁️',
  sunny: '☀️',
  clear: '☀️',
  'rain showers': '🌦️',
  rain: '🌧️',
  showers: '🌦️',
  drizzle: '🌦️',
  thunder: '⛈️',
  storm: '⛈️',
  snow: '❄️',
  flurries: '🌨️',
  sleet: '🌨️',
  fog: '☁️',
  haze: '☁️',
  windy: '💨',
  wind: '💨',
  cold: '🥶',
  hot: '☀️',
}

export function iconFromShortDescription(short: string): string {
  if (!short) return '❓'

  const lower = short.toLowerCase()
  const sortedKeys = Object.keys(SHORT_DESC_ICON_MAP).sort((a, b) => b.length - a.length)

  for (const key of sortedKeys) {
    if (lower.includes(key)) {
      return SHORT_DESC_ICON_MAP[key] ?? '?'
    }
  }

  return '❓'
}
