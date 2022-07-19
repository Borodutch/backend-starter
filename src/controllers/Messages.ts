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
import MessageText from '@/validators/MessageText'
import authMiddleware from '@/middlewares/authMiddleware'
import authorMiddleware from '@/middlewares/authorMiddleware'

@Controller('/messages')
@Flow(authMiddleware)
export default class MessagesController {
  @Get('/:id')
  @Flow(authorMiddleware)
  getMessage(@State('message') message: DocumentType<Message>) {
    return message
  }

  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageText,
    @CurrentUser() author: DocumentType<User>
  ) {
    return MessageModel.create({ text, author })
  }

  @Put('/:id')
  @Flow(authorMiddleware)
  updateMessage(
    @Body({ required: true }) { text }: MessageText,
    @State('message') message: DocumentType<Message>
  ) {
    message.text = text
    return message.save()
  }

  @Delete('/:id')
  @Flow(authorMiddleware)
  deleteMessage(@State('message') message: DocumentType<Message>) {
    return message.delete()
  }
}
