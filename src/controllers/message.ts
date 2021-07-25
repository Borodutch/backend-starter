import { Controller, Ctx, Delete, Flow, Get, Params, Post, Put } from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { authVerify } from '@/middleware/auth'

@Controller('/message')
@Flow(authVerify)
export default class MessageController {

  @Get('/')
  async sowMessages(@Ctx() ctx: Context) {
    return await MessageModel.find({})
  }

  @Post('/add')
  async addMessage(@Ctx() ctx: Context) {
    const userToken = ctx.cookies.get('jwt')
    const messageBody = ctx.request.body.message
    return await MessageModel({ authorToken: userToken, body: messageBody }).save()
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context, @Params('id') id_: string) {
    const userToken = ctx.cookies.get('jwt')
    const msg = await MessageModel.find({ _id: id_ })
    if (msg[0].authorToken === userToken) {
      MessageModel.findByIdAndDelete(id_, (err) => {
        if (err) console.log(err)
      })
      return msg
    }
    return ctx.throw(400, 'Only author can delete this message')
  }

  @Put('/:id')
  async editMessage(@Ctx() ctx: Context, @Params('id') id_: string) {
    const userToken = ctx.cookies.get('jwt')
    const msgToEdit = await MessageModel.find({ _id: id_ })
    if (msgToEdit[0].authorToken === userToken) {
      return await MessageModel.findByIdAndUpdate(id_, { body: ctx.request.body.editMessage })
    }
    return ctx.throw(400, 'Only author can edit this message')
  }
}