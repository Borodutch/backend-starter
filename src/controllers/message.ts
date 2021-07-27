import { Context } from 'koa'
import { User } from '@/models/user'
import {
  Controller,
  Ctx,
  Post,
  Get,
  Put,
  Delete,
  Flow,
  Params,
  CurrentUser,
  Body,
} from 'amala'
import { MessageModel as Message } from '@/models/message'
import { userAuth } from '@/middleware/auth'

@Controller('/message')
@Flow(userAuth)
export default class MessageController {
  @Get('/:id')
  async getMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user: User
  ) {
    const message = await Message.findOne({
      _id: id,
      user: user,
    })
    if (!message) {
      ctx.throw(404)
    }
    return message
  }

  @Get('/')
  async getMessageByUser(@Ctx() ctx: Context, @CurrentUser() user) {
    const message = await Message.find({
      user
    })
    if (!message) {
      ctx.throw(404)
    }
    return message
  }

  @Post('/')
  async createMessage(@CurrentUser() user, @Body('text') text: any) {
    const newMessage = new Message({
      user: user,
      text: text,
    })
    await newMessage.save()
    return { status: 'ok', id: newMessage._id }
  }

  @Delete('/:id')
  async deleteMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user
  ) {
    const ret = await Message.findOneAndDelete({
      _id: id,
      user: user,
    })
    if (!ret) {
      return ctx.throw(404)
    }
    return ret
  }

  @Put('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user: User,
    @Body('text') text: string
  ) {
    const message = Message.findOneAndUpdate(
      {
        _id: id,
        user: user,
      },
      { text: text }
    )
    if (!message) {
      return ctx.throw(404)
    }
    return message
  }
}
