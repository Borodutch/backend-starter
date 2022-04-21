import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { badRequest, notFound } from '@hapi/boom'

export default async function checkMessage(ctx: Context, next: Next) {
  const messageId = ctx.params.id

  if (!messageId) {
    return ctx.throw(badRequest())
  }

  const message = await MessageModel.findById(messageId)

  if (!messageId) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message
  return next()
}
