import { Context } from 'koa'
import { verify } from '@/helpers/jwt'
import { UserModel } from '../models/user'


export default async (ctx: Context, next) => {
    try {
        const token = ctx.header.token as string
        await verify(token)
        ctx.state.user = await UserModel.findOne({ token })
    }catch (error){
        ctx.status = 404
        ctx.body = { error: 'Unauthorized' }
        console.log(error, 'error in auth middlware');
   }
}