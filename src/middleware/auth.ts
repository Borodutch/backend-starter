import { Context, Next } from 'koa'
import { UserModel } from '@/models/user'
import { verify } from '@/helpers/jwt'

interface JWTObject {
  name: string
  email: string
  iat: number
}

const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.token as string

  try {
    const { email } = (await verify(token)) as JWTObject

    try {
      const { name } = await UserModel.findOne({ email })
      ctx.state.user = name
      return next()
    } catch (err) {
      ctx.status = 200
      ctx.message = 'Пользователь не найден'
    }
  } catch (err) {
    ctx.status = 200
    ctx.message = err.message
  }
}

export default auth
