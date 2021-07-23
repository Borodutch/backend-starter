import { Controller, Ctx, Delete, Get, Params, Post, Put } from 'amala'
import { Context } from 'koa'
import { message } from '@/models/message'
import { authVerify } from '@/middleware/auth'


@Controller('/message')
export default class messageController {

  @Get('/show-all')
  async sowMessages(@Ctx() ctx: Context) {
    return await message.find({})
  }

  @Post('/add')
  async addMessage(@Ctx() ctx: Context) {
    const userToken = ctx.cookies.get('jwt')
    await authVerify(ctx, userToken)
    const messageBody = ctx.request.body.message
    return await message({ authorToken: userToken, body: messageBody }).save()
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context, @Params('id') id_: string) {
    const userToken = ctx.cookies.get('jwt')
    await authVerify(ctx, userToken)
    const msg = await message.find({ _id: id_ })
    if (msg[0].authorToken === userToken) {
      message.findByIdAndDelete( id_, (err) =>  {
        if(err) console.log(err)
      })
      return msg
    }
    return ctx.throw(400,'Only author can delete this message')
  }

  @Put('/:id')
  async editMessage(@Ctx() ctx: Context, @Params('id') id_: string){
    const userToken = ctx.cookies.get('jwt')
    await authVerify(ctx, userToken)
    const msgToEdit = await message.find({ _id: id_ })
    if (msgToEdit[0].authorToken === userToken) {
      return await message.findByIdAndUpdate(id_,{ body: ctx.request.body.editMessage} )
    }
    return ctx.throw(400,'Only author can edit this message')
  }

}