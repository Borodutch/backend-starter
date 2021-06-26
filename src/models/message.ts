import { getModelForClass, prop } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  text: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export async function createMessage(text: string) {
  return await new MessageModel({ text }).save()
}

export async function getMessages() {
  return await MessageModel.find()
}

export async function findMessageById(id: string) {
  return await MessageModel.findById(id)
}

export async function deleteMessageById(id: string) {
  await MessageModel.findByIdAndDelete({ _id: id })
}

export async function updateMessage(id: string, text: string) {
  await MessageModel.findByIdAndUpdate({ _id: id }, { text })
}
