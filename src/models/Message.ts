import { getModelForClass, prop } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  text!: string
  @prop({ required: true })
  user!: string
}

const MessageModel = getModelForClass(Message)

export async function createMessage(user: string, text: string) {
  return await new MessageModel({ user, text }).save
}
