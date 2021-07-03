import * as jwt from 'jsonwebtoken'
import { Context, Next } from 'koa'

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization
  if (!token) {
    return ctx.throw(400, 'token not found')
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT)
    ctx.state.user = decoded.user

    return next()
  } catch {
    ctx.throw(401, 'Token is not valid')
  }
}
