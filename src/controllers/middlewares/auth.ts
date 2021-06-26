import { MessageModel } from '@/models/message'
import * as jwt from 'jsonwebtoken'

export const auth = async (ctx, next) => {
  const token = ctx.headers['Authorization'].split(' ')[1]
  if (!token) {
    return 'Error'
  } else {
    const user = jwt.verify(token, process.env.JWT)
    ctx.state.user = await MessageModel.findOne({ user })
    await next()
  }
}
