import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { badRequest, notFound } from '@hapi/boom'

export default async function (ctx: Context, next: Next) {
  const id = ctx.params.id

  if (!id) {
    return ctx.throw(badRequest('Message ID is absent in request'))
  }

  const message = await MessageModel.findById(id)

  if (!message || ctx.state.user.id != message.author) {
    return ctx.throw(notFound('Message is not found'))
  }

  ctx.state.message = message
  return next()
}
