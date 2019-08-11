// Dependencies
import * as mongoose from 'mongoose'

// Connect to mongoose
mongoose.connect(process.env.MONGO, { useNewUrlParser: true })

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

// Export models
export * from './user'
