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
import authMiddleware from '@/helpers/authMiddleware'
import creatorAccess from '@/helpers/creatorAccess'

@Controller('/messages')
@Flow(authMiddleware)
export default class MessagesController {
  @Get('/:id')
  @Flow(creatorAccess)
  showPrivateMessage(@State('message') message: DocumentType<Message>) {
    return message
  }

  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageText,
    @CurrentUser() creator: DocumentType<User>
  ) {
    return MessageModel.create({ text, creator })
  }

  @Put('/:id')
  @Flow(creatorAccess)
  updateMessage(
    @Body({ required: true }) { text }: MessageText,
    @State('message') message: DocumentType<Message>
  ) {
    message.text = text
    return message.save()
  }

  @Delete('/:id')
  @Flow(creatorAccess)
  deleteMessage(@State('message') message: DocumentType<Message>) {
    return message.delete()
  }
}
