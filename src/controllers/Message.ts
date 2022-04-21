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
import authorize from '@/midlewares/User'
import checkMessage from '@/midlewares/Message'

@Controller('/messages')
@Flow([authorize])
export default class Message {
  @Get('/:id')
  @Flow([checkMessage])
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
  @Flow([checkMessage])
  updateMessage(
    @State('message') message: Message,
    @Body() { text }: MessagesTextValid
  ) {
    return MessageModel.findByIdAndUpdate(message, { text }, { new: true })
  }

  @Delete('/:id')
  @Flow([checkMessage])
  deleteMessage(@State('message') message: Message) {
    return MessageModel.deleteOne(message)
  }
}
