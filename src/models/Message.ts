import { ReturnModelType, getModelForClass, prop } from '@typegoose/typegoose'
import exp from 'constants'

export class Message {
  @prop({ required: true })
  user!: string

  @prop({ required: true })
  text!: string

  public static findByUser(
    this: ReturnModelType<typeof Message>,
    user: string
  ) {
    return this.find({ user }).exec()
  }
}

const MessageModel = getModelForClass(Message)

export async function createMessage(user: string, text: string) {
  return await new MessageModel({ user, text }).save()
}

export async function getMessages(user: string) {
  return await MessageModel.findByUser(user)
}

export async function deleteMessage(id: string) {
  return await MessageModel.findOneAndDelete({ _id: id })
}

export async function updateMessage(id: string, updatedText: string) {
  return await MessageModel.findOneAndUpdate({
    _id: id,
    text: updatedText,
    new: true,
    returnOriginal: false,
  })
}
