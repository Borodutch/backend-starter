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
import { Message, messageModel } from '@/models/Message'
import { User } from 'c:/Users/user/Documents/javascript/backend-starter/src/models/User'
import MessageText from '@/validators/MessageText'
import authenticate from '@/middlewares/authentificate'
import checkAuthor from '@/middlewares/checkAuthor'

@Controller('/message')
@Flow(authenticate)
export default class Messages {
  @Post('/')
  createMessage(
    @CurrentUser() author: DocumentType<User>,
    @Body({ required: true }) { text }: MessageText
  ) {
    return messageModel.create({ text, author })
  }

  @Get('/')
  getMessage(@CurrentUser() author: DocumentType<User>) {
    return messageModel.find({ author })
  }

  @Get('/:id')
  @Flow(checkAuthor)
  getOneMessage(@State('message') message: DocumentType<Message>) {
    return message
  }

  @Put('/:id')
  @Flow(checkAuthor)
  updateMessage(
    @Body({ required: true }) { text }: MessageText,
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
