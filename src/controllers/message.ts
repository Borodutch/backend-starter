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
import { MessageModel } from '@/models/message'
import { User } from '@/models/user'
import MessageValidator from '@/validators/Message'
import auth from '@/middleware/auth'
import checkUser from '@/middleware/checkUser'

@Controller('/message')
@Flow(auth)
export default class messageController {
  @Post('/')
  @Flow(checkUser)
  createMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/:id')
  @Flow(checkUser)
  getMessages(@State('message') { text }: MessageValidator) {
    return text
  }

  @Put('/:id')
  @Flow(checkUser)
  updateMessage(
    @Body({ required: true }) { text }: MessageValidator,
    @State('message') { _id }: MessageValidator
  ) {
    return MessageModel.findByIdAndUpdate(_id, { text })
  }

  @Delete('/:id')
  @Flow(checkUser)
  deleteMessage(@State('message') { _id }: MessageValidator) {
    return MessageModel.findByIdAndDelete(_id)
  }
}
