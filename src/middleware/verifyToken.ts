import { Context } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, forbidden, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default async function verifyToken(ctx: Context) {
  const token = (await ctx.header.token) as string

  try {
    verify(token)
  } catch (error) {
    ctx.throw(forbidden())
  }

  const user = await UserModel.findOne({ token })

  if (!user) {
    ctx.throw(unauthorized())
  }

  if (!user.token) {
    ctx.throw(badRequest())
  }

  ctx.state.user = user
}
