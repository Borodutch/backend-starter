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
import { checkUsersMiddleware } from '@/helpers/checkUsersMiddleware'
import { off } from 'process'

@Controller('/message')
@Flow([authMiddleware])
export default class MessageController {
  @Post('/')
  async createMessage(@Body('text') text: string, @CurrentUser() user) {
    return await Message.create({
      text,
      user,
    })
  }

  @Get('/:id')
  @Flow([checkUsersMiddleware])
  async getMessage(@Params('id') id: string) {
    return await Message.findById(id)
  }

  @Put('/:id')
  @Flow([checkUsersMiddleware])
  async updateMessage(
    @Params('id') id: string,
    @Body() messageProps,
    @Ctx() ctx: Context
  ) {
    const message = await Message.findByIdAndUpdate(
      id,
      { $set: messageProps },
      { new: true }
    )
    if (message) {
      return message
    }
    return ctx.throw(404, 'Not Found')
  }

  @Delete('/:id')
  @Flow([checkUsersMiddleware])
  async deleteMessage(@Params() params: any) {
    const id = params.id
    return await Message.findByIdAndDelete(id)
  }
}
