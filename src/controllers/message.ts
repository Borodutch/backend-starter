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
import { MessageModel } from '@/models/Message'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'
import MessageValidator from '@/validators/MessageValidator'

@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(
    @Body({ required: true }) { message }: MessageValidator,
    @CurrentUser() user: Ref<User>
  ) {
    return await MessageModel.create({ message, user })
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') id: MessageValidator) {
    return await MessageModel.findByIdAndDelete(id)
  }

  @Get('/:id')
  async getMessageById(@Params('id') id: MessageValidator) {
    return await MessageModel.findById(id)
  }

  @Patch('/:id')
  async UpdateMessage(
    @Body({ required: true }) { message }: MessageValidator,
    @Params('id') id: MessageValidator
  ) {
    return await MessageModel.findByIdAndUpdate(id, { text: message })
  }
}
