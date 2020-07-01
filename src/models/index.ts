import * as mongoose from 'mongoose'

// Connect to mongoose
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

// Export models
export * from './user'

const logConnection = () => {
  mongoose.connection
    .once('open', () => {
      console.log('successfully connected to messagesDB')
    })
    .on('error', err => {
      console.log('Error occured: ', err)
    })
}
logConnection()
