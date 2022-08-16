import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { notFound } from '@hapi/boom'

export default async function checkUser(ctx: Context, next: Next) {
  ctx.state.message = await MessageModel.findById(ctx.params.id)
  if (!ctx.state.message) {
    return ctx.throw(notFound())
  }
  if (ctx.state.user.id != ctx.state.message.author.toString()) {
    return ctx.throw(notFound())
  }
  return next()
}
