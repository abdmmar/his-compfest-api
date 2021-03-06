import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

dotenv.config()

import HttpException from './src/utils/HttpException.js'
import errorMiddleware from './src/middleware/error.middleware.js'
import mongoose from './src/config/db.js'

import user from './src/routes/User.route.js'
import appointment from './src/routes/Appointment.route.js'
import docs from './src/routes/Docs.route.js'

const app = express()
const PORT = process.env.PORT || 9191

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
)

app.set('secret', process.env.SECRET_KEY)
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/', docs)
app.use('/user', user)
app.use('/appointment', appointment)

app.all('*', (req, res, next) => {
  const error = new HttpException(404, 'Endpoint not found')

  next(error)
})

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}...`)
})
