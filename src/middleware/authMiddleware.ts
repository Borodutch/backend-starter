import { verify } from '@/helpers/jwt'
import { forbidden } from '@hapi/boom'
import { Context } from 'koa'

export default async function checkUser(ctx: Context, next: Function) {
  const token = ctx.headers.token
  if (typeof token === 'string' && verify(token)) {
    await next()
  } else {
    ctx.throw(forbidden())
  }
}
