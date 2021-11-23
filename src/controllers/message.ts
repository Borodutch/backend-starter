import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Post,
  Put,
} from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import MongoIdMessage from '@/validators/MongoIdMessage'
import TextMessage from '@/validators/TextMessage'
import auth from '@/middleware/auth'
import checkUser from '@/middleware/checkUser'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Get('/')
  getMessages(@CurrentUser() user) {
    return MessageModel.find({ author: user })
  }

  @Post('/')
  addMessage(
    @Body({ required: true }) { text }: TextMessage,
    @CurrentUser() user
  ) {
    return new MessageModel({ author: user, text }).save()
  }

  @Delete('/:id')
  @Flow([checkUser])
  async deleteMessage(
    @CurrentUser() user,
    @Params() params: MongoIdMessage,
    @Ctx() ctx: Context
  ) {
    await MessageModel.findOneAndDelete({ author: user, _id: params.id })
    return (ctx.body = 'Сообщение удалено')
  }

  @Put('/:id')
  @Flow([checkUser])
  updateMessage(
    @CurrentUser() user,
    @Params() params: MongoIdMessage,
    @Body({ required: true }) body: TextMessage
  ) {
    return MessageModel.findOneAndUpdate(
      { author: user, _id: params.id },
      body,
      {
        new: true,
      }
    )
  }
}
