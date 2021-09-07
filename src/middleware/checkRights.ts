import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'
import { populate } from 'mongoose'

export const checkRights = async (ctx: Context, next: Next) => {
  const token = ctx.state.user.token
  const message = await MessageModel.findOne({
    _id: ctx.request.url.split('/')[2],
  }).populate('author')
  if (!message) {
    return (ctx.response.status = 404)
  }

  if (token != message.author.token) {
    return (ctx.response.status = 401)
  }
  ctx.state.message = message
  await next()
}
