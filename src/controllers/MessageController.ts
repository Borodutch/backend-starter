import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Post,
  Put,
} from 'amala'
import MessageModel from '@/models/MessageModel'
import MessageValidator from '@/validators/MessageValidator'
import UserVerificator from '@/helpers/UserVerificator'

@Controller('/message')
@Flow([UserVerificator])
export default class MessageController {
  @Post('/')
  postMessage(@Body({ required: true }) message: MessageValidator) {
    if (message.author) {
      return MessageModel.create(message)
    }
  }

  @Delete('/deleteAll/')
  deleteAllMessages() {
    return MessageModel.deleteMany()
  }

  @Delete('/:id')
  deleteMessage(@Params('id') id: string) {
    return MessageModel.findOneAndDelete({ _id: id })
  }

  @Get('/')
  getMessages() {
    return MessageModel.find()
  }

  @Get('/checkStateUser')
  checkStateUser(@CurrentUser() currentUser: typeof CurrentUser) {
    return currentUser
  }

  @Get('/:id')
  getMessage(@Params('id') id: string) {
    return MessageModel.findOne({ _id: id })
  }

  @Put('/:id')
  updateMessage(
    @Params('id') id: string,
    @Body({ required: true }) { text }: MessageValidator
  ) {
    return MessageModel.findOneAndUpdate({ _id: id }, { text }, { new: true })
  }
}
