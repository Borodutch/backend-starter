import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Get,
  Params,
  Patch,
  Post,
} from 'amala'
import {
  MessageIdValidator,
  MessageTextValidator,
} from '@/validators/MessageValidator'
import { MessageModel } from '@/models/Message'
import { User } from '@/models/User'

@Controller('/messages')
export default class MessageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageTextValidator,
    @CurrentUser() user: User
  ) {
    return MessageModel.create({ text, user })
  }

  @Delete('/:id')
  deleteMessage(@Params() params: MessageIdValidator) {
    return MessageModel.findByIdAndDelete(params.id)
  }

  @Get('/:id')
  getMessageById(@Params() params: MessageIdValidator) {
    return MessageModel.findById(params.id)
  }

  @Patch('/:id')
  async UpdateMessage(
    @Body({ required: true }) { text }: MessageTextValidator,
    @Params() params: MessageIdValidator
  ) {
    await MessageModel.findByIdAndUpdate(params.id, { text })
    return MessageModel.findById(params.id)
  }
}
