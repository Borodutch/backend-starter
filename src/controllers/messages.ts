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
import { MessageModel } from '@/models/Messages'
import MessageValidator from '@/validators/Messages'

@Controller('/messages')
export default class MessageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) { textMessage }: MessageValidator,
    @CurrentUser() user: User
  ) {
    MessageModel.create({
      user,
      textMessage: textMessage,
    })
      .then((result) => result)
      .catch((err) => err.message)
  }

  @Get('/:id')
  getMessage(@Params('id') id: string) {
    MessageModel.findById(id)
      .then((result) => result)
      .catch((err) => err.message)
  }

  @Put('/:id')
  editMessage(
    @Body({ required: true }) { textMessage }: MessageValidator,
    @CurrentUser() user: User,
    @Params('id') id: string
  ) {
    MessageModel.findByIdAndUpdate(id, {
      user,
      textMessage: textMessage,
    })
      .then((result) => result)
      .catch((err) => err.message)
  }

  @Delete('/:id')
  deleteMessage(@Params('id') id: string) {
    MessageModel.findByIdAndDelete(id)
      .then((result) => result)
      .catch((err) => err.message)
  }
}
