import { notFound } from '@hapi/boom'
import { Context, Next } from 'koa'
import MessageModel from '@/models/Message'

export default async function (ctx: Context, next: Next) {
  const message = await MessageModel.findById(ctx.params.id)

  if (!message) return ctx.throw(notFound('message not found'))
  ctx.state.message = message

  return next()
}
