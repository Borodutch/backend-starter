import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Patch,
  Post,
  State,
} from 'amala'
import { DocumentType } from '@typegoose/typegoose'
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageBody from '@/validators/MessageBody'
import auth from '@/middleware/auth'
import checkAuthor from '@/middleware/checkAuthor'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Post('/')
  addMessage(
    @Body({ required: true }) { text }: MessageBody,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ author, text })
  }

  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Delete('/:id')
  @Flow(checkAuthor)
  deleteMessage(@State('message') message: DocumentType<Message>) {
    return message.deleteOne()
  }

  @Patch('/:id')
  @Flow(checkAuthor)
  updateMessages(
    @Body({ required: true }) { text }: MessageBody,
    @State('message') message: DocumentType<Message>
  ) {
    message.text = text
    return message.save()
  }
}
