import { MessageModel as Message } from '@/models/message'
import { Context } from 'koa'
import { Controller, Ctx, Delete, Get, Params, Post, Put } from 'amala'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async createMessage(@Ctx() ctx: Context) {
    const messageProps: any = ctx.request.body
    let message = await Message.create(messageProps)
    message = await message.populate('user').execPopulate()
    return message
  }

  @Get('/:id')
  async getMessage(@Params() params: any) {
    const id = params.id
    const message = await Message.findById(id)
    return message
  }

  @Put('/:id')
  async updateMessage(@Ctx() ctx: Context) {
    const id = ctx.originalUrl.split('/')[2]
    const messageProps: any = ctx.request.body
    await Message.findByIdAndUpdate(
      id,
      { $set: messageProps },
      { new: true },
      (err, updatedMessage) => {
        if (err) {
          console.log(err)
        }
        console.log(updatedMessage)
      }
    )
  }

  @Delete('/:id')
  async deleteMessage(@Params() params: any) {
    const id = params.id
    await Message.findByIdAndDelete(id)
      .then((deleteMessage) => {
        console.log(deleteMessage)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
