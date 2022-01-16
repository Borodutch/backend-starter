import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  text!: string

  @prop({ required: true })
  user!: string
}
const MessageModel = getModelForClass(Message)

export async function createMessage(user: string, text: string) {
  return await new MessageModel({ text }).save
}

export async function updateMessage(user: string, id: string, newText: string) {
  return await MessageModel.findOneAndUpdate({
    _id: id,
    text: newText,
    new: true,
  })
}
export async function getMessages(user: string) {
  return await MessageModel.find({})
}

export async function deleteMessage(user: string, id: string) {
  return await MessageModel.deleteOne({ id: id })
}
