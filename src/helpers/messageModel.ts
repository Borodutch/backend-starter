import * as mongoose from 'mongoose'
const Message = new mongoose.Schema({
  message: {
    type: String,
  },
})
const Messages = mongoose.model('Messages', Message)
export default Messages
