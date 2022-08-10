//создаешь middleware, в котором этот токен проверяешь, находишь по нему пользователя — и добавляешь пользователя в ctx.state.user
// middleware, который проверяет ctx.req.headers.token и закидывает получившегося юзера в ctx.state.user
import { Context, Next } from 'koa'
import { User, UserModel } from '@/models/User'
import { toString } from 'lodash'
import { verify } from '@/helpers/jwt'

export default async function authMiddleware(
  ctx: Context,
  next: Next
): Promise<User> {
  const token = toString(ctx.req.headers.token)
  verify(token)
  await UserModel.findOne({ token })
  return next()
}
