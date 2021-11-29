import * as mongoose from 'mongoose'
import env from '@/helpers/env'

export function runMongo(mongoUrl = env.MONGO) {
  if (!mongoUrl) {
    throw new Error('MONGO is not defined')
  }
  return mongoose.connect(mongoUrl)
}

export function stopMongo() {
  return mongoose.disconnect()
}
