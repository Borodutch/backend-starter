import { Context } from 'koa'
import { UserModel } from '@/models/User'
import { badRequest, unauthorized } from '@hapi/boom'
import { verify } from '@/helpers/jwt'

export default function verifyToken(ctx: Context) {
  const token = ctx.header.token as string
  const user = UserModel.findOne({ token })

  if (user === null) {
    unauthorized('There is no user...')
  }

  if (!user.token) {
    badRequest('There is no token...')
  }

  verify(user.token)
}
