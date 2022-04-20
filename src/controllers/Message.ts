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
import { MessageModel } from '@/models/Message'
import { MessagesTextValid } from '@/validators/Message'
import { User } from '@/models/User'
import authorizationMidleware from '@/midlewares/userMidleWare'
import messageMidleware from '@/midlewares/messageMidleWare'

@Controller('/messages')
@Flow([authorizationMidleware])
export default class Message {
  @Get('/:id')
  @Flow([messageMidleware])
  findMessage(@State('message') message: Message) {
    return message
  }

  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessagesTextValid,
    @CurrentUser() user: User
  ) {
    return MessageModel.create({ user, text })
  }

  @Patch('/:id')
  @Flow([messageMidleware])
  updateMessage(
    @State('message') message: Message,
    @Body() { text }: MessagesTextValid
  ) {
    return MessageModel.findByIdAndUpdate(message, { text }, { new: true })
  }

  @Delete('/:id')
  @Flow([messageMidleware])
  deleteMessage(@State('message') message: Message) {
    return MessageModel.deleteOne(message)
  }
}
