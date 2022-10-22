import { Context,Next } from 'koa'
import { messageModel } from '../models/Message'

export async function checkAuthorship( ctx:Context,next:Next ) {
    const id = ctx.params.id
    const user = ctx.state.user
    const message = await messageModel.findById(id)
    ctx.state.message = message
   if ( message!.author != user.id) {return ctx.throw(404,'not found')}       
   else next()       
}