import mongoose from 'mongoose'
const Schema = mongoose.Schema

const MessageSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)
const Message = mongoose.model('user', MessageSchema)
export default Message
