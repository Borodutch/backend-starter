import { Context, Next } from 'koa'
import { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '@/models/user'
import { isJWT } from 'class-validator'
import { isMongoId } from 'class-validator'
import { notFound, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

const auth = async (ctx: Context, next: Next) => {
  let token = ctx.header.authorization as string
  token = token.replace('Bearer ', '')

  if (!token) {
    return ctx.throw(unauthorized('token not found'))
  }

  if (!isJWT(token)) {
    return ctx.throw(unauthorized('invalid token'))
  }

  const { id } = (await verify(token)) as JwtPayload

  if (!isMongoId(id)) {
    return ctx.throw(unauthorized('invalid id'))
  }

  const user = await UserModel.findById(id)

  if (!user) {
    return ctx.throw(notFound('user not found'))
  }

  ctx.state.user = user
  return next()
}

export default auth
