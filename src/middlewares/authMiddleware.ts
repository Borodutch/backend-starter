import { MessageModel } from '@/models/message'
import { UserModel } from '@/models/user'
import { Context } from 'koa'

export async function authMiddleware(ctx: Context, next) {
  const token = ctx.headers['token']
  const messageId = ctx.params.id
  const user = await UserModel.findOne({ token: token })
  const message = await MessageModel.findById(messageId)
  if (!token) {
    return ctx.throw(401, "You're not logged in")
  }

  if (user.token !== message.author.token) {
    return ctx.throw(401, 'invalid auth')
  }
  await next()
}
