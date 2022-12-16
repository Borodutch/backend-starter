import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { badRequest, forbidden, notFound } from '@hapi/boom'

export default async function checkAuthorship(ctx: Context, next: Next) {
  const id = ctx.params.id
  if (!id) {
    ctx.throw(badRequest('Message ID is absent'))
  }
  const message = await MessageModel.findById(id)
  if (!message) {
    ctx.throw(notFound('There is no message with this ID'))
  }
  if (ctx.state.user.id != message.author) {
    ctx.throw(forbidden())
  }
  ctx.state.message = message
  return next()
}
