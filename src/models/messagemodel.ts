//const mongoose = require('mongoose')
import { getModelForClass, prop } from '@typegoose/typegoose'

class messages {
    @prop()
    public posting_date?: string
  
    @prop()
    public author_name?: string

    @prop()
    public message_body?: string
  }

export const Message = getModelForClass(messages)

/*const Schema = mongoose.Schema

// create message schema and model

const MessageSchema = new Schema({
    posting_date: {
        type: Date
    },
    author_name: {
        type: String,
        required: [true, 'Name field is require']
    },
    message_body: {
        type: String
    }
})

const Message = mongoose.model('message', MessageSchema)
module.exports = Message
*/