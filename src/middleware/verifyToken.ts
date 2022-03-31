import { Context, Next } from 'koa'
import { UserModel } from '@/models/User'
import { verify } from '@/helpers/jwt'

export default  function verifyToken(ctx: Context, next: Next) {
  const token = ctx.header.token as string

  if(token === null){
    throw new Error("There is no token...");
  }

  if (token) {
    verify(token)
  }

  const user = UserModel.findOne({ token })

  if(user === null){
    throw new Error("There is no user...");
  } else {
    ctx.state.user = user
    return next()
  }
}
