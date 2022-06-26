import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { notFound } from '@hapi/boom'

export default async function checkAuthor(ctx: Context, next: Next) {
  const messageId = ctx.params.id
  const message = await MessageModel.findById(messageId)
  if (!message || !message.author) {
    return ctx.throw(notFound())
  }

  const userId = ctx.state.user.id
  const messageAuthor = message.author.toString()
  if (userId !== messageAuthor) {
    return ctx.throw(notFound())
  }
  ctx.state.message = message

  return next()
}
