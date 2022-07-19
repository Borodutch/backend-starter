import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { notAcceptable, notFound } from '@hapi/boom'

export default async function authorAccess(ctx: Context, next: Next) {
  const id = ctx.params.id
  const message = await MessageModel.findById(id)
  if (!message) {
    return ctx.throw(notFound('Message not found'))
  }
  if (!message.author) {
    return ctx.throw(notFound('Author not found'))
  }
  const userId = ctx.state.user.id
  const messageAuthor = message.author.toString()
  if (userId !== messageAuthor) {
    return ctx.throw(notAcceptable())
  }
  ctx.state.message = message
  return next()
}
