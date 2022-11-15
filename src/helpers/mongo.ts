import * as mongoose from 'mongoose'
import env from '@/helpers/env'

export default function runMongo(mongoUrl = env.MONGO) {
  mongoose.connection.on(
    'error',
    console.error.bind(console, 'MongoDB connection error:')
  )
  return mongoose.connect(mongoUrl)
}
