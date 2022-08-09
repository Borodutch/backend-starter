import MessageModel from '@/models/Message'
import { Context } from 'koa'

export default async function (ctx: Context, next: () => Promise<void>) {
  ctx.state.message = await MessageModel.findById(ctx.params.id)
  return next()
}
