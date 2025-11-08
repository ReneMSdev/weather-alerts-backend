import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import weatherRoutes from './routes/weather.routes'

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Middleware
app.use(cors()) // Enable CORS for all routes
app.use(express.json()) // Parse JSON request bodies

// Test route
app.get('/', (req, res) => {
  res.send('🌤️ Weather Alerts API is running!!')
})

// TODO: Add routes like:
// app.use('/weather', weatherRoutes)
app.use('/weather', weatherRoutes)

// app.use('/device', deviceRoutes)
// app.use('/alerts', alertsRoutes)

export default app
