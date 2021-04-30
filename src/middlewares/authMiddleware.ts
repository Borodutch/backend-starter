import { Context } from 'koa'
import { verify } from '@/helpers/jwt'
import { getOrCreateUser } from '@/models/user'

export async function authMiddleware(ctx: Context, next) {
  try {
    const payload = await verify(ctx.headers.token as string)
    const user = await getOrCreateUser({
      name: payload['email'],
      email: payload['email'],
    })
    ctx.request.body['userId'] = user['_id']
    return next()
  } catch (error) {
    console.log(error)
    return ctx.throw(401)
  }
}
