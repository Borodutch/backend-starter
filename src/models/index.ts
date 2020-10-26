import * as mongoose from 'mongoose'

export default function runMongo(mongoUrl: string = process.env.MONGO) {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  mongoose.set('useCreateIndex', true)
  mongoose.set('useFindAndModify', false)
}
