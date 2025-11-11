import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import app
import app from './app'

// Set port
const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
