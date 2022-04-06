import { Context } from 'koa'
import {
  badData,
  boomify,
  isBoom,
  methodNotAllowed,
  notFound,
} from '@hapi/boom'

export default async function (ctx: Context, next: any) {
  try {
    await next()
  } catch (error: any) {
    if (error.path) {
      return ctx.throw(
        badData(`${error.path}: invalid value, have to be ${error.kind}`)
      )
    } else if (isBoom(error)) {
      return ctx.throw(error)
    } else {
      return ctx.throw(boomify(error))
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
