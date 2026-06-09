import mongoose from 'mongoose'
import { beforeAll, afterAll } from '@jest/globals'

import { initDatabase } from '../db/init'

//initialize our database connection in mongoose before all tests run
beforeAll(async () => {
  await initDatabase()
})

// disconnect from the database after all test finish running
afterAll(async () => {
  await mongoose.disconnect()
})
