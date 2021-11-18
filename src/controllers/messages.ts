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
import { userAuth } from '@/middleware/auth'

@Controller('/message')
@Flow(userAuth)
export default class MessageController {
  @Get('/')
  async showMessages(@CurrentUser() author: User) {
    return await MessageModel.find({ author })
  }

  @Post('/')
  async addMessage(@CurrentUser() author: User, @Body('text') text: string) {
    return await new MessageModel({ author, text }).save()
  }

  @Put('/:id')
  async editMessage(
    @Ctx() ctx: Context,
    @Body('text') text: string,
    @Params('id') id: string
  ) {
    return await MessageModel.updateOne({ _id: id }, { text: text })
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context, @Params('id') id: string) {
    return await MessageModel.deleteOne({ _id: id })
  }
}
