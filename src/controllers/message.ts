/* eslint-disable require-await */
import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Post,
  Put,
} from 'amala'
import { MessageModel } from '@/models/message'
import { User } from '@/models/user'
import auth from '@/middleware/auth'
import checkUser from '@/middleware/checkUser'

@Controller('/message')
@Flow(auth)
export default class messageController {
  @Post('/')
  @Flow(checkUser)
  async createMessage(@Body('text') text: string, @CurrentUser() author: User) {
    return MessageModel.create({ text, author })
  }

  @Get('/:id')
  @Flow(checkUser)
  async getMessages(@Params('id') id: string) {
    return MessageModel.findById(id)
  }

  @Put('/:id')
  @Flow(checkUser)
  async updateMessage(@Params('id') id: string, @Body('text') text: string) {
    return MessageModel.findByIdAndUpdate(id, { text })
  }

  @Delete('/:id')
  @Flow(checkUser)
  async deleteMessage(@Params('id') id: string) {
    return MessageModel.findByIdAndDelete(id)
  }
}
