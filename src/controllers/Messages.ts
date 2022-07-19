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
import authorization from '@/middlewares/authorization'
import checkAuthor from '@/middlewares/checkAuthor'

@Controller('/messages')
@Flow(authorization)
export default class MessagesController {
  @Get('/:id')
  @Flow(checkAuthor)
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
