import { verify } from '@/helpers/jwt'
import { MessageModel } from '@/models/message'
import { Context, Next } from 'koa'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization
  if (!token) {
    return ctx.throw(400, 'token not found')
  }
  try {
    ctx.state.user = await verify(token)
    return next()
  } catch {
    ctx.throw(401, 'Token is not valid')
  }
}

export const check = async (ctx: Context, next: Next) => {
  const message = await MessageModel.findOne({
    _id: ctx.params.id,
    author: ctx.state.user,
  })
  
  if (message) {
    ctx.state.message = message
  } else {
    return ctx.throw(404, 'message not found')
  }
  return next()
}
