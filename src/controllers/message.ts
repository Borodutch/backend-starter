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
import MessageData from '@/validators/MessageData'
import authUser from '@/middleware/authUser'
import checkAuthorship from '@/middleware/checkAuthorship'

@Controller('/message')
@Flow(authUser)
export default class MessageController {
  @Post('/create')
  createMessage(
    @Body({ required: true }) { text }: MessageData,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ author, text })
  }

  @Get('/')
  getAllMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow(checkAuthorship)
  getMessageById(@State('message') message: Message) {
    return message
  }

  @Put('/:id')
  @Flow(checkAuthorship)
  updateMessage(
    @Body({ required: true }) { text }: MessageData,
    @State('message') message: DocumentType<Message>
  ) {
    message.text = text
    return message.save()
  }

  @Delete('/:id')
  @Flow(checkAuthorship)
  deleteMessageById(@State('message') message: Message) {
    return MessageModel.deleteOne({ message })
  }

  @Delete('/')
  deleteAllMessagesForUser(@CurrentUser() author: User) {
    return MessageModel.deleteMany({ author })
  }
}
