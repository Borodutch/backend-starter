import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'

export default async function checkAuthor(ctx: Context, next: Next) {
  const messageId = ctx.params.id
  const message = await MessageModel.findById(messageId)
  if (!message) {
    return ctx.throw(400)
  }

  const userId = ctx.state.user.id
  const messageAuthor = message.author.toString()
  if (userId !== messageAuthor) {
    return ctx.throw(404)
  }
  ctx.state.message = message

  return next()
}
