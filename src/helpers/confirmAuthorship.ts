import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { notFound } from '@hapi/boom'

export default async function (ctx: Context, next: Next) {
  const messageId = ctx.params.id
  if (!messageId) {
    return next()
  }
  const message = await MessageModel.findById(messageId)
  if (ctx.state.user.id !== message?.author?.toString()) {
    throw notFound()
  }
  ctx.state.message = message
  return next()
}
