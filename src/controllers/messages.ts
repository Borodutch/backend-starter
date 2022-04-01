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
import MessageValidator from '@/validators/MessageValidator'
import authorMiddleware from '@/helpers/authorMiddleware'
import tokenMiddleware from '@/helpers/tokenMiddleware'

@Controller('/messages')
@Flow(tokenMiddleware)
export default class MessageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author: author })
  }

  @Patch('/:id')
  @Flow(authorMiddleware)
  updateMessage(
    @State('message') message: DocumentType<Message>,
    @Body({ required: true }) { text }: MessageValidator
  ) {
    message.text = text
    return message.save()
  }

  @Delete('/:id')
  @Flow(authorMiddleware)
  removeMessage(@State('message') message: DocumentType<Message>) {
    console.log(message)
    return message.remove()
  }
}
