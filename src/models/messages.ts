import { prop, getModelForClass, Ref, getName } from '@typegoose/typegoose'
import { User, UserModel } from './user'

export class Message {
  @prop({ ref: 'User' })
  user: Ref<User>
  @prop()
  content: string
}
export const MessageModel = getModelForClass(Message)

export async function findMessageByUserId(username) {
  let entry = await MessageModel.findOne({ user: username })
  if (!entry) throw new Error(`Failed to find the message`)
  return entry
}

export async function createMessage(userId, content) {
  //if (!options.user) throw new Error('User not stated')
  let foundUser = await UserModel.findById(userId)
  if (!foundUser)
    throw new Error(`Failed to find the user who created a message`)
  let message = await new MessageModel({
    content: content,
    user: foundUser,
  }).save()
  return message
}

export async function updateMessage(id, values) {
  let message = await MessageModel.findOneAndUpdate(id, values)
  if (!message) throw new Error(`Failed to find and update message`)
  return message
}
export async function findUpdatedMessage(id) {
  return await MessageModel.findOne(id)
}

export async function deleteMessage(query) {
  let answer = await MessageModel.findOneAndRemove(query)
  if (!answer) throw new Error(`Failed to find an entry for deleting`)
  return answer
}
