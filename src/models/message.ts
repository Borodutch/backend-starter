// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const messageSchema = new Schema({
//   body: {
//     type: String,
//     required: true
//   },
//   createdBy: {
//     type: String,
//     required: true
//   }
// }, {timestamps: true})

// export const Message = mongoose.model('Message', messageSchema)

import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

export class Message {
  @prop()
  body: string

  @prop()
  createdBy: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

interface MessageOptions {
  body: string
  createdBy: string
}