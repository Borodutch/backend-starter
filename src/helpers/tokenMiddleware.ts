import { Context, Next } from 'koa'
import { verify } from 'jsonwebtoken'
import env from '@/helpers/env'

export default async function verifToken(ctx: Context, next: Next) {
  const token = ctx.header.token as string
  if (!token) {
    return ctx.redirect('/login')
  }
  await verify(token, env.JWT, async (err) => {
    if (err) {
      return ctx.redirect('/login')
    }
    ctx.append('token', token)
    await next()
  })
}
