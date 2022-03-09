import { Body, Controller, Post, Delete, Put, Get, Params } from 'amala'
import { UserModel, User } from '@/models/User'
import { MessageModel } from '@/models/Messages'
import { MessageValidator, MessageIdValidator } from '@/validators/Messages'

@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @Body('userId') userId: String
  ) {
    const user = await UserModel.findById(userId)
    if (user) {
      return MessageModel.create({
        user,
        text,
      })
    } else {
      return { error: 'User not found' }
    }
  }

  @Get('/')
  async getMessages() {
    return MessageModel.find()
  }

  @Get('/:message_id')
  async getMessage(@Params('message_id') message_id: MessageIdValidator) {
    return MessageModel.findById(message_id)
  }

  @Put('/:message_id')
  async editMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @Params('message_id') message_id: MessageIdValidator
  ) {
    return MessageModel.findByIdAndUpdate(message_id, {
      text,
    })
  }

  @Delete('/:message_id')
  async deleteMessage(@Params('message_id') message_id: MessageIdValidator) {
    return MessageModel.findByIdAndDelete(message_id)
  }
}
