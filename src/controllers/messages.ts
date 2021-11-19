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
import { User } from '@/models/user'
import userAuth from '@/middleware/auth'
import MongoMessage from '@/validators/MongoMessage'

@Controller('/message')
@Flow(userAuth)
export default class MessageController {
  @Get('/')
  showMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Post('/')
  addMessage(@CurrentUser() author: User, @Body('text') text: string) {
    return new MessageModel({ author, text }).save()
  }

  @Put('/:id')
  async editMessage(
    @Ctx() ctx: Context,
    @Body('text') text: string,
    @Params('id') _id: MongoMessage
  ) {
    return await MessageModel.updateOne({ _id: _id }, { text: text })
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context, @Params('id') _id: MongoMessage) {
    return await MessageModel.deleteOne({ _id: _id })
  }
}
