import { Context, Next } from 'koa'
import { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '@/models/user'
import { notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

const auth = async (ctx: Context, next: Next) => {
  let token = ctx.header.authorization as string
  token = token.replace('Bearer ', '')
  const { id } = (await verify(token)) as JwtPayload
  const user = await UserModel.findById(id)

  if (!token) {
    return ctx.throw(notFound())
  }

  if (!user) {
    return ctx.throw(notFound())
  }

  ctx.state.user = user
  return next()
}

export default auth
