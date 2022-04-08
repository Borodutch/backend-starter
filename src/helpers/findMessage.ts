import { CurrentUser } from 'amala'
import { notFound } from '@hapi/boom'
import MessageModel from '@/models/MessageModel'

export default async function (messageId: string, currentUserId: string) {
  const message = await MessageModel.findById(messageId)
  if (currentUserId.toString() !== message?.author?.toString()) {
    throw notFound(`there's no message with such id and author`)
  }
  return message
}
