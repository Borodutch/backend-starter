import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function message(ctx: Context, next: Next) {
  if (!isValidObjectId(ctx.params.id)) {
    return ctx.throw(badRequest())
  }

  const message = await MessageModel.findById(ctx.params.id)
  if (!message) {
    return ctx.throw(notFound())
  }

  if (ctx.state.user.id != message.user) {
    return ctx.throw(notFound())
  }

  return next()
}
