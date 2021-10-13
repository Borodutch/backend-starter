import { MessageModel } from '@/models/message'
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
import auth from '@/middleware/auth'
import checkUser from '@/middleware/checkUser'
import { User } from '@/models/user'
import { Context } from 'koa'

@Controller('/message')
@Flow(auth)
export default class messageController {
  @Post('/')
  async createMessage(
    @Body('newMessage') text: string,
    @CurrentUser() user: User
  ) {
    return MessageModel.create({ text, user })
  }

  @Get('/:id')
  @Flow(checkUser)
  async getMessages(@Params('id') id: string) {
    return await MessageModel.findById(id)
  }

  @Put('/:id')
  @Flow(checkUser)
  async updateMessage(
    @Params('id') id: string,
    @Body('newMessage') text: string
  ) {
    MessageModel.findByIdAndUpdate(id, { text })
    return MessageModel.findById(id)
  }

  @Delete('/:id')
  @Flow(checkUser)
  async deleteMessage(@Params('id') id: string) {
    return MessageModel.findByIdAndDelete(id)
  }
}
