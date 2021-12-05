import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

const auth = async (ctx: Context, next: Next) => {
  const token = await verify(ctx.headers.token as string)
  if (!token) {
    return ctx.throw(notFound('Token is not valid'))
  }

  const user = await UserModel.findOne({ filter: token })
  if (!user) {
    return ctx.throw(notFound('User not found'))
  }

  ctx.state.user = user

  return next()
}

export default auth
