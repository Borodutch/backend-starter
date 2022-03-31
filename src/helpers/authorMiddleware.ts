import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { forbidden, notFound } from '@hapi/boom'
import { isMongoId } from 'amala'

export default async function authorMiddleware(ctx: Context, next: Next) {
  const messageId = ctx.params.id
  if (!isMongoId(messageId)) {
    return ctx.throw(forbidden())
  }
  const message = await MessageModel.findById(messageId)
  if (!message) {
    return ctx.throw(notFound())
  }
  if (message.author?.toString() !== ctx.state.user.id) {
    return ctx.throw(forbidden())
  }
  ctx.state.message = message
  return next()
}
