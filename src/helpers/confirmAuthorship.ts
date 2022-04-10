import { Context, Next } from 'koa'
import { notFound } from '@hapi/boom'
import MessageModel from '@/models/MessageModel'

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
