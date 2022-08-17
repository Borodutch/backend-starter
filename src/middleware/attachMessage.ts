import { Context } from 'koa'
import MessageModel from '@/models/Message'

export default async function (ctx: Context, next: () => Promise<null>) {
  ctx.state.message = await MessageModel.findById(ctx.params.id)
  return next()
}
