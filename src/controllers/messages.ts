import {
  Body,
  Controller,
  Post,
  Delete,
  Put,
  Get,
  CurrentUser,
  Params,
} from 'amala'
import { User } from '@/models/User'
import { Message, MessageModel } from '@/models/Messages'
import MessageValidator from '@/validators/Messages'

@Controller('/messages')
export default class MessageController {
  @Post('/')
  async createMessage(
    @Body({ required: true }) body: MessageValidator,
    @CurrentUser() user: User
  ) {
    return await MessageModel.create({
      user,
      textMessage: body.textMessage,
    }).catch((err) => err.message)
  }

  @Get('/:id')
  async getMessage(@Params('id') id: string) {
    return await MessageModel.findById(id).catch((err) => err.message)
  }

  @Put('/:id')
  async editMessage(
    @Body({ required: true }) body: MessageValidator,
    @CurrentUser() user: User,
    @Params('id') id: string
  ) {
    return await MessageModel.findByIdAndUpdate(id, {
      user,
      textMessage: body.textMessage,
    }).catch((err) => err.message)
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') id: string) {
    return await MessageModel.findByIdAndDelete(id).catch((err) => err.message)
  }
}
