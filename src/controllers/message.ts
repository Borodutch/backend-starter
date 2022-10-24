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
import authenticate from '@/middleware/authenticate'
import checkAuthorship from '@/middleware/checkAuthorship'
import MessageText from '@/validators/MessageText'

@Controller('/message')
@Flow(authenticate)
export default class messageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageText,
    @CurrentUser() author: DocumentType<User>
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/:id')
  @Flow(checkAuthorship)
  getMessageById(@State('message') message: DocumentType<Message>) {
    return message
  }

  @Delete('/:id')
  @Flow(checkAuthorship)
  deleteMessage(@State('message') message: DocumentType<Message>) {
    return message.delete()
  }

  @Put('/:id')
  @Flow(checkAuthorship)
  updateMessage(
    @State('message') message: DocumentType<Message>,
    @Body({ required: true }) { text }: MessageText
  ) {
    message.text = text
    return message.save()
  }
}
