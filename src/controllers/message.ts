import { MessageModel as Message } from '@/models/message'
import { Context } from 'koa'
import { Body, Controller, Ctx, Delete, Get, Params, Post, Put } from 'amala'

@Controller('/message')
export default class MessageController {
  @Post('/')
  async createMessage(@Body() leadData: { accessToken: string }) {
    const messageProps = leadData
    let message = await Message.create(messageProps)
    message = await message.populate('user').execPopulate()
    return message
  }

  @Get('/:id')
  async getMessage(@Params('id') id: string) {
    const message = await Message.findById(id)
    return message
  }

  @Put('/:id')
  async updateMessage(@Params('id') id: string, @Ctx() ctx: Context) {
    console.log(ctx.request.body)
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
    Message.findByIdAndDelete(id)
      .then((deleteMessage) => {
        console.log(deleteMessage)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
