import { verify } from '@/helpers/jwt'
import { Context } from 'koa'

export const  authVerify = async (ctx: Context, token: string) => {
  if(!token){
    return ctx.throw(400,'Please sign Up')
  }
  ctx.state.user =  await verify(token)
}