const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, {timestamps: true})

const Message = mongoose.model('Message', messageSchema)
export = Message;