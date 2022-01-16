import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function findUserMsg(ctx: Context, next: Next) {
  if (!isValidObjectId(ctx.params.id)) {
    return ctx.throw(badRequest('MessageId must be mongoose ObjectId type'))
  }

  const message = await MessageModel.findById(ctx.params.id)
  if (!message || ctx.state.user.id !== message?.author?.toString()) {
    return ctx.throw(notFound("Can't find message with this id"))
  }
  ctx.state.message = message
  return next()
}
