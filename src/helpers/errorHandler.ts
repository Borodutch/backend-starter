import { Context, Next } from 'koa'
import { boomify, methodNotAllowed, notFound } from '@hapi/boom'

export default async function (ctx: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    if (error instanceof Error) {
      throw boomify(error)
    }
  }
  const response = await ctx.body
  if (response === undefined) {
    return ctx.throw(methodNotAllowed())
  }
  if (response === null) {
    return ctx.throw(notFound())
  }
  return
}
