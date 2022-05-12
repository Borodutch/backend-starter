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
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import CreateMessageInput from '@/validators/CreateMessageInput'
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
  getMessageById(@State('message') message: Message) {
    return message
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
    @State('message') message: Message,
    @Body({ required: true }) { text }: CreateMessageInput
  ) {
    return MessageModel.findByIdAndUpdate(message, { text }, { new: true })
  }

  @Delete('/:id')
  @Flow(verifyMessage)
  deleteMessage(@State('message') message: Message) {
    return MessageModel.deleteOne({ message })
  }
}
