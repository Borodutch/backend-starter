import {
  Body,
  Controller,
  Post,
  Delete,
  Put,
  Get,
  Flow,
  CurrentUser,
  State,
} from 'amala'
import { User } from '@/models/User'
import { Message, MessageModel } from '@/models/Messages'
import { MessageTextValidator } from '@/validators/messages'
import checkUser from '@/middleware/authMiddleware'
import checkMessage from '@/middleware/messageMiddleware'

@Controller('/messages')
@Flow([checkUser])
export default class MessageController {
  @Post('/')
  async createMessage(
    @Body({ required: true }) { text }: MessageTextValidator,
    @CurrentUser() user: User
  ) {
    return MessageModel.create({
      user,
      text,
    })
  }

  @Get('/')
  async getMessages(@CurrentUser() user: User) {
    return MessageModel.find({ user })
  }

  @Get('/:messageId')
  @Flow([checkMessage])
  async getMessage(@State('message') message: Message) {
    return message
  }

  @Put('/:messageId')
  @Flow([checkMessage])
  async editMessage(
    @State('message') message: Message,
    @Body({ required: true }) { text }: MessageTextValidator
  ) {
    return MessageModel.findByIdAndUpdate(message.id, { text })
  }

  @Delete('/:messageId')
  @Flow([checkMessage])
  async deleteMessage(@State('message') message: Message) {
    return MessageModel.findByIdAndDelete(message.id)
  }
}
