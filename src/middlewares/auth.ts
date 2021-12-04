import { Context, Next } from 'koa'
import { notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization
  if (!token) {
    return ctx.throw(notFound('Token not found'))
  }
  ctx.state.user = await verify(token)
  return next()
}

export default auth
