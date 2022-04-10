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
import { User } from '@/models/User'
import MessageBody from '@/validators/MessageBody'
import MessageModel from '@/models/MessageModel'
import authenticate from '@/helpers/authenticate'
import confirmAuthorship from '@/helpers/confirmAuthorship'

@Controller('/message')
@Flow([authenticate, confirmAuthorship])
export default class MessageController {
  @Post('/')
  postMessage(
    @Body({ required: true }) { text }: MessageBody,
    @CurrentUser() user: DocumentType<User>
  ) {
    const author = user.strippedAndFilled()
    return MessageModel.create({ author, text })
  }

  @Delete('/:id')
  deleteMessage(@State('message') message: DocumentType<MessageBody>) {
    return message.delete()
  }

  @Get('/')
  getMessages(@CurrentUser() { _id }: DocumentType<User>) {
    return MessageModel.find({ author: _id })
  }

  @Get('/:id')
  getMessage(@State('message') message: DocumentType<MessageBody>) {
    return message
  }

  @Put('/:id')
  updateMessage(
    @Body({ required: true }) { text }: MessageBody,
    @State('message') message: DocumentType<MessageBody>
  ) {
    message.text = text
    return message.save()
  }
}
