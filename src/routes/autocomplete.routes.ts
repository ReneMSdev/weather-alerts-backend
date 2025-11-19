import { Router, Request, Response } from 'express'
import axios from 'axios'
import rateLimit from 'express-rate-limit'
import { ipKeyGenerator } from 'express-rate-limit'

const router = Router()

// --------------------
// Constants
// --------------------
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 50 //

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
  keyGenerator: (req: any): string => {
    const token = typeof req.body?.sessionToken === 'string' ? req.body.sessionToken : ''
    return token || ipKeyGenerator(req as any)
  },
  message: 'Too many requests, please try again later.',
})

// --------------------
// Route
// --------------------
router.post(
  '/',
  limiter,
  async (req: Request, res: Response<AutocompleteResponse | ErrorResponse>) => {
    const { query, sessionToken } = req.body

    if (!query) return res.status(400).json({ error: 'Query parameter is required.' })
    if (!sessionToken) return res.status(400).json({ error: 'Session token is required.' })

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'Google API key is not configured.' })

    try {
      const requestBody = {
        input: query,
        sessionToken: sessionToken,
        includedPrimaryTypes: ['(cities)'], // restrict to cities
        languageCode: 'en',
        regionCode: 'US',
      }

      const response = await axios.post(
        'https://places.googleapis.com/v1/places:autocomplete',
        requestBody,
        {
          headers: {
            'X-Goog-Api-Key': apiKey,
          },
        }
      )

      const suggestions = response.data.suggestions || []

      const predictions: AutocompletePrediction[] = suggestions
        .filter((s: any) => s.placePrediction) // only take place predictions
        .map((s: any) => {
          const p = s.placePrediction
          return {
            city: p.structuredFormat?.mainText?.text || '',
            state: p.structuredFormat?.secondaryText?.text || '',
            description: p.text?.text || '',
            placeId: p.placeId,
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
