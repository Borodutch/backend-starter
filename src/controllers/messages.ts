import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Patch,
  Post,
  State,
} from 'amala'
import { DocumentType } from '@typegoose/typegoose'
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import CreateMessageInput from '@/validators/CreateMessageInput'
import MessageId from '@/validators/MessageId'
import verifyMessage from '@/middleware/verifyMessage'
import verifyToken from '@/middleware/verifyToken'

@Controller('/messages')
@Flow(verifyToken)
export default class MessageController {
  @Get('/')
  getMessagesByAuthor(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }
  @Get('/:id')
  @Flow(verifyMessage)
  getMessageById(@Params('id') _id: string) {
    return MessageModel.findById({ _id })
  }

  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: CreateMessageInput,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Patch('/:id')
  @Flow(verifyMessage)
  updateMessage(
    @State('message') message: CreateMessageInput,
    @Body({ required: true }) { text }: CreateMessageInput
  ) {
    return MessageModel.findByIdAndUpdate(message, { text }, { new: true })
  }

  @Delete('/:id')
  deleteMessage(@Params('id') _id: string) {
    return MessageModel.remove({ _id })
  }
}
