import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'

export default async function getMessage(ctx: Context, next: Next) {
  const id = ctx.params.id

  if (!id) {
    return ctx.throw(notFound())
  }

  if (!isValidObjectId(id)) {
    return ctx.throw(badRequest('id is not valid'))
  }

  const message = await MessageModel.findById(id)
  if (!message) {
    return ctx.throw(notFound())
  }

  if (message.author && message.author.toString() !== ctx.state.user.id) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message

  return next()
}
