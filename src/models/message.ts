import * as mongoose from 'mongoose'


const messageSchema = mongoose.Schema({
  authorToken: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  timeOfCreation: {
    type: Date,
    default: Date.now(),
  },
})

const message = mongoose.model('message', messageSchema)

export { message }

