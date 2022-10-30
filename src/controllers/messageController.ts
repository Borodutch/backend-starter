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
import MessageBody from '@/validators/MessageBody'
import authenticate from '@/middlewares/authenticate'
import checkAuthor from '@/middlewares/checkAuthor'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  sendMessage(
    @Body({ required: true }) { text }: MessageBody,
    @CurrentUser() author: DocumentType<User>
  ) {
    return MessageModel.create({ author, text })
  }

  @Get('/')
  getAllMessages(@CurrentUser() author: DocumentType<User>) {
    return MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow(checkAuthor)
  getOneMessage(@State('message') message: DocumentType<Message>) {
    return message
  }

  @Put('/:id')
  @Flow(checkAuthor)
  updateMessage(
    @Body({ required: true }) { text }: MessageBody,
    @State('message') message: DocumentType<Message>
  ) {
    message.text = text
    return message.save()
  }

  @Delete('/:id')
  @Flow(checkAuthor)
  deleteMessage(@State('message') message: DocumentType<Message>) {
    return message.delete()
  }
}
