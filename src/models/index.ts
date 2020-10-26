import * as mongoose from 'mongoose'

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.set('debug', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

export { mongoose }
