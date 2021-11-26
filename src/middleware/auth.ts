import { Boom, notFound, unauthorized } from '@hapi/boom'
import { Context, Next } from 'koa'
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { UserModel } from '@/models/user'
import { isMongoId } from 'class-validator'
import { verify } from '@/helpers/jwt'

const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.token as string

  if (!token) {
    ctx.throw(unauthorized('token not found'))
  }

  try {
    const { id } = (await verify(token)) as JwtPayload

    if (!isMongoId(id)) {
      ctx.throw(unauthorized('incorrect id'))
    }

    const user = await UserModel.findById(id)

    if (!user) {
      ctx.throw(notFound('user not found'))
    }

    ctx.state.user = user
    return next()
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      ctx.throw(unauthorized(err as unknown as string))
    }

    if (err instanceof Boom) {
      ctx.throw(err)
    }
  }
}

export default auth
