import { verify } from '@/helpers/jwt'
import { Context } from 'koa';

export default async (ctx: Context, next) => {
  try {
    const token: string = ctx.header.token as string;
    await verify(token)    
    await next()
  } catch(err) {
    console.log(err);
    ctx.status = 401
    ctx.body = { error: 'Unauthorized' }
  }
}