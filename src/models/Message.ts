import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true })
  text!: string
  id!: number

  @prop({ required: true })
  user!: string
}

const MessageModel = getModelForClass(Message)

export async function createMessage(user: string, text: string) {
  return await MessageModel.create(user, text)
}
export async function findMessage(idMessage: number) {
  return await MessageModel.findById(idMessage)
}
export async function updateMessage(user: string, idMessage: number, newText: string) {
  return await MessageModel.updateOne({user: user, id: idMessage}, {$set: {text: newText}})
}
export async function deleteMessage(idMessage: number) {
  return await MessageModel.findByIdAndDelete(idMessage)
}