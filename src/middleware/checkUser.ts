import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'
import { notFound } from '@hapi/boom'

export default async (ctx: Context, next: Next) => {
  const message = await MessageModel.findById(ctx.params.id)
  const user = ctx.state.user

  if (message.author.toString() != user._id.toString()) {
    return ctx.throw(notFound())
  }

  ctx.state.message = message

  return next()
}
