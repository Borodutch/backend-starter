import { Context, Next } from 'koa'
import { MessageModel } from '@/models/Message'
import { forbidden, notFound } from '@hapi/boom'
import { toString } from 'lodash'

export default async function checkUser(ctx: Context, next: Next) {
  ctx.state.message = await MessageModel.findById(ctx.params.id)
  if (!ctx.state.message) {
    return ctx.throw(notFound())
  }
  console.log(ctx.state.message)
  if (toString(ctx.state.user._id) === toString(ctx.state.message.author)) {
    return next()
  }
  return ctx.throw(forbidden())
}
