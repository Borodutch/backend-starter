import { Context, Next } from 'koa'
import { badRequest, notFound } from '@hapi/boom'
import { isValidObjectId } from 'mongoose'
import { messageModel } from '@/models/Message'

export default async function checkAuthor(ctx: Context, next: Next) {
  const id = ctx.params.id

  if (!id) {
    return ctx.throw(badRequest('id is not found'))
  }
  if (!isValidObjectId(id)) {
    return ctx.throw(badRequest('not valid id'))
  }
  const message = await messageModel.findById(id)

  if (!message) {
    return ctx.throw(notFound('message is not found'))
  }

  if (ctx.state.user.id != message.author?.toString()) {
    return ctx.throw(notFound('not your message'))
  } else {
    ctx.state.message = message
  }
  return next()
}
