import { MessageModel as Message } from '@/models/message'
import { Context } from 'koa'
import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Get,
  Params,
  Post,
  Put,
  Flow,
} from 'amala'
import { authMiddleware } from '@/helpers/authMiddleware'

@Controller('/message')
@Flow([authMiddleware])
export default class MessageController {
  @Post('/')
  async createMessage(@Body('text') text: string, @CurrentUser() currentUser) {
    const user = currentUser._id
    const message = await Message.create({
      text,
      user,
    })
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
    await Message.findByIdAndDelete(id, function (err, deleteMessage) {
      if (err) {
        console.log(err)
      } else {
        console.log(deleteMessage)
      }
    })
  }
}
