import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

export class Message {
  @prop({ index: true, required: true })
  userId: string

  @prop({ index: true, required: true })
  text: string

  // Mongo property
  _doc: any
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

export async function addMessage(userId: string, messageText: string) {
  let message: DocumentType<Message> | undefined

  message = await new MessageModel({
    userId,
    text: messageText,
  }).save()

  return message
}

export async function deleteMessage(userId: string, id: string) {
  return MessageModel.findOneAndDelete({ _id: id, userId })
}

export async function updateMessage(
  id: string,
  userId: string,
  messageText: string
) {
  return MessageModel.findByIdAndUpdate(
    id,
    { userId, text: messageText },
    { new: true, useFindAndModify: false }
  )
}

export async function getMessages(userId: string) {
  return MessageModel.find({ userId })
}

export async function getMessage(userId: string, id: string) {
  return MessageModel.findOne({ _id: id, userId })
}
