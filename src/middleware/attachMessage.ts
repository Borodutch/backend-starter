import { Context, Next } from 'koa'
import MessageModel from '@/models/Message'

export default async function (ctx: Context, next: () => Next) {
  ctx.state.message = await MessageModel.findById(ctx.params.id)
  return next()
}
