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
  return await MessageModel.create(user, text)
}
export async function findMessage(idMessage: string) {
  return await MessageModel.findById(idMessage)
}
export async function updateMessage(idMessage: string, newText: string) {
  return await MessageModel.updateOne({id: idMessage}, {$set: {text: newText}})
}
export async function deleteMessage(idMessage: string) {
  return await MessageModel.deleteOne({id: idMessage})
}