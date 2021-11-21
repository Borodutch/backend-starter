import { Context, Next } from 'koa'
import { verify } from '@/helpers/jwt'

const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.token as string

  try {
    ctx.state.user = await verify(token)
    await next()
  } catch (err) {
    ctx.throw(401, err.message)
  }
}

export default auth
