import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'

export default async function creatorAccess(ctx: Context, next: Next) {
  const id = ctx.params.id
  const message = await MessageModel.findById(id)
  if (!message) {
    throw new Error('Message not found')
  }
  if (!message.creator) {
    throw new Error('Creator not found')
  }

  const userId = ctx.state.user.id
  const messageCreator = message.creator.toString()
  console.log(userId, messageCreator)
  if (userId !== messageCreator) {
    throw new Error('Something went terribly wrong...')
  }
  ctx.state.message = message
  return next()
}
