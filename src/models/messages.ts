import { prop, getModelForClass, Ref } from '@typegoose/typegoose'
import { User } from '../models/user'

export class Message {
  @prop({ required: true })
  userId: string

  @prop({ required: true })
  user: Ref<User>

  @prop({ required: true })
  text: string
}

export const MessageModel = getModelForClass(Message)

export async function createMessage(userId, ctx) {
  let message = await new MessageModel({
    userId: userId,
    user: ctx.user,
    text: ctx.text,
  }).save()
  return message
}
