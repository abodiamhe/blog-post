import mongoose from 'mongoose'

export function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL

  mongoose.connection.on('open', () => {
    console.info(`Sucessfully connected to database: ${DATABASE_URL}`)
  })

  //Connect to our mongoDB database
  const connection = mongoose.connect(DATABASE_URL)
  return connection
}
