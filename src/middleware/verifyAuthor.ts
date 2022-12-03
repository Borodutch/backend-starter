import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function (ctx: Context, next: Next) {
  if (!isValidObjectId(ctx.params.id)) {
    return ctx.throw(badRequest())
  }

  ctx.state.message = await MessageModel.findById(ctx.params.id)
  if (!ctx.state.message) {
    return ctx.throw(notFound())
  }

  if (ctx.state.user.id !== ctx.state.message.author.toString()) {
    return ctx.throw(notFound())
  }

  return next()
}
