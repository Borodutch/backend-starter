import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { verify } from '@/helpers/jwt'

interface JWTObject {
  id: string
  iat: number
}

const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.token as string
  try {
    const { id } = (await verify(token)) as JWTObject
    try {
      const user = await UserModel.findById(id)
      ctx.state.user = user
      return next()
    } catch (err) {
      ctx.status = 404
      ctx.body = {
        message: 'user not found',
      }
    }
  } catch (err) {
    ctx.status = 401
    ctx.body = err
  }
}

export default auth
