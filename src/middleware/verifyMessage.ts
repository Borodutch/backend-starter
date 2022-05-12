import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function verifyMessage(ctx: Context, next: Next) {
  if (!ctx.params.id) {
    return ctx.throw(badRequest())
  }

  if (!isValidObjectId(ctx.params.id)) {
    return ctx.throw(badRequest())
  }

  const message = await MessageModel.findById(ctx.params.id)

  if (!message) {
    return ctx.throw(notFound())
  }

  if (!message.author) {
    return ctx.throw(badRequest())
  }

  if (message.author.toString() !== ctx.state.user.id) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message
  return next()
}
