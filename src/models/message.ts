import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

export class Message {
  @prop({ index: true })
  text?: string
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export function createMessage(body: object) {
  return new MessageModel(body).save()
}

export async function readMessageById(id: string) {
  return MessageModel.findById(id)
}

export function updateMessageByIdAndText(id: string, body: { text: string }) {
  let { text } = body
  return MessageModel.findByIdAndUpdate(id, { text })
}

export function deleteMessageById(id: string) {
  return MessageModel.findByIdAndDelete(id)
}
