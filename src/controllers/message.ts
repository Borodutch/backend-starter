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
  async createMessage(@Body('text') text: string, @CurrentUser() user) {
    const message = await Message.create({
      text,
      user,
    })
    return message
  }

  @Get('/:id')
  async getMessage(
    @Params('id') id: string,
    @CurrentUser() user,
    @Ctx() ctx: Context
  ) {
    const message = await Message.findById(id)
    if (String(message.user) === String(user._id)) {
      return message
    } else {
      return ctx.throw(404, 'Not Found')
    }
  }

  @Put('/:id')
  updateMessage(
    @Params('id') id: string,
    @Body() messageProps,
    @Ctx() ctx: Context
  ) {
    Message.findByIdAndUpdate(
      id,
      { $set: messageProps },
      { new: true },
      (err, updatedMessage) => {
        if (err) {
          return ctx.throw(404, 'Not Found')
        }
        return updatedMessage
      }
    )
  }

  @Delete('/:id')
  deleteMessage(@Params() params: any) {
    const id = params.id
    Message.findByIdAndDelete(id, function (err, deleteMessage) {
      if (err) {
        console.log(err)
      } else {
        console.log(deleteMessage)
      }
    })
  }
}
