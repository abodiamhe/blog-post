import express from 'express'
import { postsRoutes } from './routes/posts.js'
import cors from 'cors'

const app = express()
app.use(cors()) //allowing access from other URLs
app.use(express.json()) //Parse incoming json object

postsRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

export { app }
