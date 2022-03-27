import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { badRequest, notAcceptable, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function messageMiddleware(ctx: Context, next: Function) {
  const id = ctx.params.id
  const user = ctx.state.user._id

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
  if (!user.equals(message.author)) {
    return ctx.throw(notAcceptable())
  }

  ctx.state.message = message

  return next()
}
