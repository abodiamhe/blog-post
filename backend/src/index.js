import dotenv from 'dotenv'
dotenv.config()

import { app } from './app.js'
import { initDatabase } from './db/init.js'

try {
  await initDatabase() //Initialize the database
  const PORT = process.env.PORT || 3001
  app.listen(PORT, '0.0.0.0')
  console.log(`express server running on http://localhost:${PORT}`)
} catch (err) {
  console.error('erro connection to database:', err)
}
