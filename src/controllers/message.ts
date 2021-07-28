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
import { MessageModel } from '@/models/message'
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
    const message = await MessageModel.findOne({
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
    const message = await MessageModel.find({
      user,
    })
    return message
  }

  @Post('/')
  async createMessage(@CurrentUser() user, @Body('text') text: string) {
    return await new MessageModel({ user, text }).save()
  }

  @Delete('/:id')
  async deleteMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user
  ) {
    const deleteMessage = await MessageModel.findOneAndDelete({
      _id: id,
      user: user,
    })
    if (!deleteMessage) {
      return ctx.throw(404)
    }
  }

  @Put('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @CurrentUser() user: User,
    @Body('text') text: string
  ) {
    const message = await MessageModel.findOneAndUpdate(
      { _id: id, user },
      { text }
    )
    if (!message) {
      return ctx.throw(404)
    }
    return message
  }
}
