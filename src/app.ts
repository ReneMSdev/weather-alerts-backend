import express from 'express'
import cors from 'cors'
import weatherRoutes from './routes/weather.routes'
import deviceRoutes from './routes/device.routes'
import autocompleteRoutes from './routes/autocomplete.routes'

// Create Express app
const app = express()

// Middleware
app.use(cors()) // Enable CORS for all routes
app.use(express.json()) // Parse JSON request bodies

// Test route
app.get('/', (req, res) => {
  res.send('🌤️ Weather Alerts API is running!!')
})

// Weather routes
app.use('/weather', weatherRoutes)

// Device routes
app.use('/device', deviceRoutes)

// Autocomplete route
app.use('/autocomplete', autocompleteRoutes)

// Alerts routes
// app.use('/alerts', alertsRoutes)

export default app
