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
import { MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import Message from '@/models/Message'
import MessageBody from '@/validators/MessageBody'
import authenticate from '@/helpers/authenticate'
import confirmAuthorship from '@/helpers/confirmAuthorship'

@Controller('/message')
@Flow([authenticate])
export default class MessageController {
  @Post('/')
  postMessage(
    @Body({ required: true }) { text }: MessageBody,
    @CurrentUser() author: DocumentType<User>
  ) {
    return MessageModel.create({ author, text })
  }

  @Delete('/:id')
  @Flow([confirmAuthorship])
  deleteMessage(@State('message') message: DocumentType<Message>) {
    return message.delete()
  }

  @Get('/')
  getMessages(@CurrentUser() author: DocumentType<User>) {
    return MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow([confirmAuthorship])
  getMessage(@State('message') message: DocumentType<Message>) {
    return message
  }

  @Put('/:id')
  @Flow([confirmAuthorship])
  updateMessage(
    @Body({ required: true }) { text }: MessageBody,
    @State('message') message: DocumentType<Message>
  ) {
    message.text = text
    return message.save()
  }
}
