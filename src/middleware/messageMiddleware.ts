import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Messages'
import { Types } from 'mongoose'
import { badRequest, notFound } from '@hapi/boom'

export default async (ctx: Context, next: Next) => {
  const { messageId } = ctx.params
  const { user } = ctx.state

  if (!messageId || !user) {
    return ctx.throw(notFound)
  }

  if (!Types.ObjectId.isValid(messageId)) {
    return ctx.throw(badRequest())
  }

  const message = await MessageModel.findById(messageId)
  if (!message) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message

  return next()
}
