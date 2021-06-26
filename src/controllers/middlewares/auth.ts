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

export const login = async (ctx) => {
  const user = await MessageModel.findOne({ author: ctx.request.body })
  if (!user) {
    return 'user not found'
  } else {
    const token = jwt.sign({ user }, process.env.JWT)
    ctx.headers['Authorization'] = 'Bearer ' + token
  }
}
