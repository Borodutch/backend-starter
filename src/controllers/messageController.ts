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
import { Message, messageModel } from '@/models/messageModel'
import { User } from '@/models/User'
import MessageBody from '@/validators/MessageBody'
import authenticate from '@/middlewares/authenticate'
import authorValidation from '@/middlewares/authorValidation'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  postMessage(
    @CurrentUser() author: DocumentType<User>,
    @Body({ required: true }) { text }: MessageBody
  ) {
    return messageModel.create({ author, text })
  }
  @Get('/:id')
  @Flow(authorValidation)
  getMessages(@State('message') message: DocumentType<Message>) {
    return message
  }
  @Delete('/:id')
  @Flow(authorValidation)
  deleteMessage(@State('message') message: DocumentType<Message>) {
    return message.delete()
  }
  @Put('/:id')
  @Flow(authorValidation)
  updateMessage(
    @State('message') message: DocumentType<Message>,
    @Body({ required: true }) { text }: MessageBody
  ) {
    message.text = text
    return message.save()
  }
}
