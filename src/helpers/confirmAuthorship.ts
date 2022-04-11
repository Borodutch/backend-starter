import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { badRequest, notFound } from '@hapi/boom'
import { isMongoId } from 'amala'

export default async function (ctx: Context, next: Next) {
  const messageId = ctx.params.id
  if (!isMongoId(messageId)) {
    throw badRequest()
  }
  const message = await MessageModel.findById(messageId)
  if (ctx.state.user.id !== message?.author?.toString()) {
    throw notFound()
  }
  ctx.state.message = message
  return next()
}
