import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function messageMiddleware(ctx: Context, next: Function) {
  const id = ctx.params.id
  const userId = ctx.state.user._id

  if (!id) {
    return ctx.throw(badRequest())
  }

  if (!isValidObjectId(id)) {
    return ctx.throw(badRequest())
  }

  const message = await MessageModel.findById({ _id: id })
  if (!message) {
    return ctx.throw(notFound())
  }
  if (!userId.equals(message.author)) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message

  return next()
}
