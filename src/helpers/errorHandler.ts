import { Context, Next } from 'koa'
import { methodNotAllowed, notFound } from '@hapi/boom'

export default async function (ctx: Context, next: Next) {
  await next()
  const response = await ctx.body
  if (response === undefined) {
    return ctx.throw(methodNotAllowed())
  }
  if (response === null) {
    return ctx.throw(notFound())
  }
  return
}
