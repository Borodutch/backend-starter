import { Context, Next } from 'koa'
import { MessageModel } from '@/models/message'
import { UserModel } from '@/models/user'
import { populate } from 'mongoose'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization.split(' ')[1]
  if (!token) {
    ctx.throw(401, 'Token is undefined')
  }
  ctx.state.user = await UserModel.findOne({ token })
  if (ctx.state.user === null) {
    return (ctx.response.status = 401)
  }

  await next()
}

export const authMessage = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization.split(' ')[1]
  const message = await MessageModel.findOne({
    _id: ctx.request.url.split('/')[2],
  }).populate('author')
  if (!message) {
    return (ctx.response.status = 404)
  }

  if (token != message.author['token']) {
    return (ctx.response.status = 401)
  }
  ctx.state.user = message.author
  ctx.state.message = message
  await next()
}
