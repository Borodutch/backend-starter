import * as mongoose from 'mongoose'
import env from '@/helpers/env'

mongoose.set('strictQuery', true)
export default function runMongo(mongoUrl = env.MONGO) {
  return mongoose.connect(mongoUrl)
}
