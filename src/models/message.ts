import { prop, getModelForClass } from "@typegoose/typegoose";
import { update } from "lodash";

const mongoose = require('mongoose');

// const Schema = new mongoose.Schema({
//   date: {
//     type: Date,
//     default: new Date()
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   text: {
//     type: String,
//     required: true,
//     default: ''
//   }
// })

// module.exports = mongoose.model('Message', Schema)

export class MessageSchema {
  @prop({ required: false, default: new Date() })
  public date: Date;

  @prop({ required: true })
  public title: String

  @prop({ required: true, default: '' })
  public text: String
}

const Message = getModelForClass(MessageSchema);

export const MessageModel = getModelForClass(MessageSchema, {
  schemaOptions: { timestamps: true },
})

export async function getAllMessages() {
  const messages = MessageModel.find()
  return messages
}

export async function deleteMessage(id) {
  const message = MessageModel.findByIdAndDelete(id)
  return message
}

export async function updateMessage({id, text}) {
  const message = MessageModel.findByIdAndUpdate(id, {
    text
  })
  return message
}

export async function createMessage({title, text}) {
  const message = MessageModel.create({title, text})
  return message
}

  // let message = MessageModel.create({title: 'Tst', text: 'hello, test!'})

// import { sign } from '../helpers/jwt'
// import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'
// import { omit } from 'lodash'

// export class Message {
//   @prop({ index: true, default: new Date() })
//   date: Date
//   @prop({ index: true, lowercase: true, required: true })
//   title: string
//   @prop({ index: true, lowercase: true, default: '', required: true })
//   text: string

//   strippedAndFilled(withExtra = false, withToken = true) {
//     const stripFields = ['createdAt', 'updatedAt', '__v']
//     if (!withExtra) {
//       stripFields.push('date')
//       stripFields.push('title')
//       stripFields.push('text')
//     }
//     return omit(this._doc, stripFields)
//   }

//   // Mongo property
//   _doc: any
// }

// export const MessageModel = getModelForClass(Message, {
//   schemaOptions: { timestamps: true },
// })

// interface LoginOptions {
//   date: Date
//   title: string
//   text: string
// }

// export async function getOrCreateUser(loginOptions: LoginOptions) {
//   if (!loginOptions.title) {
//     throw new Error()
//   }
//   let message: DocumentType<Message> | undefined
//   // Try text
//   if (loginOptions.text) {
//     message = await MessageModel.findOne({ email: loginOptions.text })
//   }
//   return message
// }