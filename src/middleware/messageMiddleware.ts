import { MessageModel } from '@/models/Messages'
import { notFound } from '@hapi/boom'
import { Context } from 'koa'
import { Types } from 'mongoose'

export default async function checkMessage(ctx: Context, next: Function) {
  const { user } = ctx.state
  const { messageId } = ctx.params

  if (!user || !messageId) {
    return ctx.throw(notFound())
  }

  if (!Types.ObjectId.isValid(messageId)) {
    return ctx.throw(notFound())
  }

  const message = await MessageModel.findOne({ _id: messageId, user })
  if (!message) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message

  return next()
}
