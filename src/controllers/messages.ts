import { Body, Controller, Delete, Flow, Get, Post, Put, State } from 'amala'
import { Message, MessageModel } from '@/models/Messages'
import { User } from '@/models/User'
import MessageTextValidator from '@/validators/Messages'
import authMiddleware from '@/middleware/authMiddleware'
import messageMiddleware from '@/middleware/messageMiddleware'

@Controller('/messages')
@Flow([authMiddleware])
export default class MessageController {
  // eslint-disable-next-line require-await
  @Get('/')
  async getMessages(@State('user') author: User) {
    return MessageModel.find({ author })
  }

  // eslint-disable-next-line require-await
  @Post('/')
  async createMessages(
    @Body({ required: true }) { text }: MessageTextValidator,
    @State('user') author: User
  ) {
    return MessageModel.create({ author, text })
  }

  // eslint-disable-next-line require-await
  @Get('/:messageId')
  @Flow([messageMiddleware])
  async getMessage(@State('message') message: Message) {
    return message
  }

  // eslint-disable-next-line require-await
  @Put('/:messageId')
  @Flow([messageMiddleware])
  async editMessage(
    @State('message') message: Message,
    @Body({ required: true }) { text }: MessageTextValidator
  ) {
    return MessageModel.findByIdAndUpdate(
      message.id,
      { text },
      { returnDocument: 'after' }
    )
  }

  // eslint-disable-next-line require-await
  @Delete('/:messageId')
  @Flow([messageMiddleware])
  async deleteMessage(@State('message') message: Message) {
    return MessageModel.findByIdAndDelete(message.id)
  }
}
