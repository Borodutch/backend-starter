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
import { DocumentType } from '@typegoose/typegoose'
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageTextValidator from '@/validators/MessageText'
import checkAuth from '@/middleware/checkAuth'
import checkMessage from '@/middleware/checkMessage'

@Controller('/messages')
@Flow([checkAuth])
export default class MessageController {
  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Post('/')
  createMessages(
    @Body({ required: true }) { text }: MessageTextValidator,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ author, text })
  }

  @Get('/:messageId')
  @Flow([checkMessage])
  getMessage(@State('message') message: Message) {
    return message
  }

  @Put('/:messageId')
  @Flow([checkMessage])
  editMessage(
    @State('message') message: DocumentType<Message>,
    @Body({ required: true }) { text }: MessageTextValidator
  ) {
    return MessageModel.findByIdAndUpdate(
      message.id,
      { text },
      { returnDocument: 'after' }
    )
  }

  @Delete('/:messageId')
  @Flow([checkMessage])
  deleteMessage(@State('message') message: DocumentType<Message>) {
    return MessageModel.findByIdAndDelete(message.id)
  }
}
