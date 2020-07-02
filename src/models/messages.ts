import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

export class Message {
  @prop({ required: true })
  user: string
  @prop()
  content: string
}
export const MessageModel = getModelForClass(Message)

export async function findMessageByUsername(username) {
  let entry = await MessageModel.findOne({ user: username })
  if (!entry) throw new Error(`Failed to find the message`)
  return entry
}

export async function createMessage(options) {
  if (!options.user) throw new Error('User not stated')
  let message = await new MessageModel(options).save()
  return message
}

export async function updateMessage(id, values) {
  let message = await MessageModel.findOneAndUpdate(id, values)
  if (!message) throw new Error(`Failed to find and update entry`)
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
