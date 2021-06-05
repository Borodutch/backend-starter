import * as mongoose from 'mongoose'

export function runMongo(mongoUrl = process.env.MONGO) {
  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
}

export function stopMongo() {
  return mongoose.disconnect()
}
