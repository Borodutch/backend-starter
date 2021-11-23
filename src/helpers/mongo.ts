import * as mongoose from 'mongoose'

export function runMongo(mongoUrl = process.env.MONGO) {
  if (!mongoUrl) {
    throw new Error('MONGO is not defined')
  }
  return mongoose.connect(mongoUrl)
}

export function stopMongo() {
  return mongoose.disconnect()
}
