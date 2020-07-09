import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { User } from "./user";

export class MessageSchema {
  @prop({ required: false, default: new Date() })
  date: Date;

  @prop({ required: true })
  title: String

  @prop({ required: true, default: '' })
  text: String

  @prop({ ref: 'User' })
  user: Ref<User>
}

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