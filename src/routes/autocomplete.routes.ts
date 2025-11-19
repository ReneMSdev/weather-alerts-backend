import { Router, Request, Response } from 'express'
import axios from 'axios'
import rateLimit from 'express-rate-limit'

const router = Router()

// --------------------
// Constants
// --------------------
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute or 60000 milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5 // max 5 per minute

// --------------------
// Types
// --------------------
export interface AutocompleteRequest {
  query: string
  sessionToken: string
}

export interface AutocompletePrediction {
  city: string
  state: string
  description: string
  placeId: string
}

export interface AutocompleteResponse {
  predictions: AutocompletePrediction[]
}

export interface ErrorResponse {
  error: string
}

// --------------------
// Rate Limiter
// --------------------
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  keyGenerator: (req): string => {
    const token = typeof req.query.sessionToken === 'string' ? req.query.sessionToken : ''
    return token || String(req.ip)
  },
  message: 'Too many requests, please try again later.',
})

// --------------------
// Route
// --------------------
router.get(
  '/',
  limiter,
  async (
    req: Request<{}, {}, {}, Partial<AutocompleteRequest>>,
    res: Response<AutocompleteResponse | ErrorResponse>
  ) => {
    const query = typeof req.query.query === 'string' ? req.query.query : ''
    const sessionToken = typeof req.query.sessionToken === 'string' ? req.query.sessionToken : ''

    if (!query) return res.status(400).json({ error: 'Query parameter is required.' })
    if (!sessionToken) return res.status(400).json({ error: 'Session token is required.' })

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'Google API key is not configured.' })

    try {
      // -------------------------
      // Call Places API (New)
      // -------------------------
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:autocomplete',
        {
          input: query,
          sessionToken,
          includedPrimaryTypes: ['locality'], // returns cities only
          languageCode: 'en',
          regionCode: 'US',
        },
        {
          headers: {
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': [
              'places.id',
              'places.displayName.text',
              'places.formattedAddress',
            ].join(','),
          },
        }
      )

      const places = response.data.places || []

      const predictions: AutocompletePrediction[] = places.map((place: any) => {
        const full = place.formattedAddress || ''
        const [city, state] = full.split(',').map((s: string) => s.trim())

        return {
          city: city || '',
          state: state || '',
          description: full,
          placeId: place.id,
        }
      })

      return res.json({ predictions })
    } catch (err: any) {
      console.error(
        'Error fetching Places API (New) autocomplete:',
        err.response?.data || err.message
      )
      return res.status(500).json({ error: 'Failed to fetch autocomplete data.' })
    }
  }
)

export default router
