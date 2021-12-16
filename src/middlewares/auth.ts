import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { notFound } from '@hapi/boom'

const auth = async (ctx: Context, next: Next) => {
  let token = ctx.header.authorization as string
  token = token.replace('Bearer ', '')
  ctx.state.user = await UserModel.findOne({ token })

  if (!token) {
    return ctx.throw(notFound())
  }

  if (!ctx.state.user) {
    return ctx.throw(notFound())
  }

  return next()
}

export default auth
