import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { notFound } from '@hapi/boom'

export default async function checkAuthorship(ctx: Context, next: Next) {
  const id = ctx.params.id
  const user = ctx.state.user
  const message = await MessageModel.findById(id)
  ctx.state.message = message
  if (!message) {
    return ctx.throw(notFound('not found'))
  }
  if (message.author != user.id) {
    return ctx.throw(notFound('not found'))
  }
  return next()
}
