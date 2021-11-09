/* eslint-disable require-await */
import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
  State,
} from 'amala'
import { Message, MessageModel } from '@/models/message'
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
  async getMessages(@State('message') message: Message) {
    return message
  }

  @Put('/:id')
  @Flow(checkUser)
  async updateMessage(
    @Body('text') text: string,
    @State('message')
    message: Message & {
      _id: string
    }
  ) {
    return MessageModel.findByIdAndUpdate(message._id, { text })
  }

  @Delete('/:id')
  @Flow(checkUser)
  async deleteMessage(
    @State('message')
    message: Message & {
      _id: string
    }
  ) {
    return MessageModel.findByIdAndDelete(message._id)
  }
}
