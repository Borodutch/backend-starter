import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  text?: string
}

export const MessageModel = getModelForClass(Message)

export async function сreateMessage(itemOptions: { text: string }) {
  const option = { upsert: true, new: true }
  return MessageModel.findOneAndUpdate(itemOptions, {}, option)
}

export async function findMessage(id: string) {
  return MessageModel.findById(id)
}

export async function updateMessage(id: string, itemOptions: { text: string }) {
  return MessageModel.findByIdAndUpdate(id, itemOptions)
}

export async function removeMessage(id: string) {
  return MessageModel.findByIdAndDelete(id)
}
