import { Context, Next } from 'koa'
import { verify } from '@/helpers/jwt'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'
import { isEqual } from 'lodash'
import { findMessageById } from '@/models/message'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization.split(' ')[1]
  if (!token) {
    return ctx.throw(400, 'No token provided')
  }
  ctx.state.user = await verify(token)
  return await next()
}

export const userVerify = async function (messageId: string, user: Ref<User>) {
  const message = await findMessageById(messageId)
  const messageAuthor = message.author
  if (isEqual(user, messageAuthor)) {
    return true
  } else {
    return false
  }
}
