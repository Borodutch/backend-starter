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
import { Message, messageModel } from '../models/Message'
import { User } from '../models/User'
import { messageText } from '../validators/MessageText'
import { authentication } from '../middleware/auth'
import { checkAuthorship } from '../middleware/checkAuthorship'
import { DocumentType } from '@typegoose/typegoose'

@Controller('/message')
@Flow(authentication)
export class messageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) text: messageText,
    @CurrentUser() author: DocumentType<User>
  ) {
    return messageModel.create({ text, author })
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
    @Body({ required: true }) text: string
  ) {
    message.text = text
    return message.save()
  }
}
