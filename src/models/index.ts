import * as mongoose from 'mongoose'

export function runMongo(mongoUrl = process.env.MONGO) {
  return mongoose.connect(mongoUrl)
}
export function stopMongo() {
  return mongoose.disconnect()
}
