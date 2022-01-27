import { getModelForClass, prop } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  user!: string

  @prop({ required: true })
  text!: string
}

const MessageModel = getModelForClass(Message)

export function createMessage(user: string, text: string) {
  return new MessageModel({ user, text }).save()
}

export function getMessages(user: string) {
  return MessageModel.find({ user }).exec()
}

export function deleteMessage(id: string) {
  return MessageModel.findOneAndDelete({ _id: id })
}

export function updateMessage(id: string, updatedText: string) {
  return MessageModel.findOneAndUpdate({
    _id: id,
    text: updatedText,
    new: true,
    returnOriginal: false,
  })
}
