import { prop, getModelForClass } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  text: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export function createMessage(text: string) {
  return new MessageModel(text).save()
}

export async function readMessageById(id: number | string) {
  return MessageModel.findById(id)
}

export function updateMessageByIdAndText(id: number | string, text) {
  return MessageModel.findByIdAndUpdate(id, text)
}

export function deleteMessageById(id: number | string) {
  return MessageModel.findByIdAndDelete(id)
}
