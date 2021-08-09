import {Context, Next} from 'koa'
import { MessageModel } from '@/models/message'
export async function CheckUser(ctx: Context, next: Next){
    const message = await MessageModel.findById(ctx.params.id)

    const user = ctx.state.user

    if(message.user == user.id) {
        return next()
    }
}
