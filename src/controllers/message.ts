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
} from 'amala'
import { MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageText from '@/validators/Message'
import MongoId from '@/validators/MongoId'
import authenticate from '@/middleware/authenticate'
import verifyUser from '@/middleware/verifyUser'

@Controller('/messages')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  createMessage(
    @Body({ required: true }) { text }: MessageText,
    @CurrentUser() user: User
  ) {
    return MessageModel.create({ text: text, user: user })
  }

  @Flow(verifyUser)
  @Delete('/:id')
  deleteMessage(@Params() params: MongoId) {
    return MessageModel.findByIdAndDelete(params.id)
  }

  @Flow(verifyUser)
  @Get('/:id')
  getMessageById(@Params() params: MongoId) {
    return MessageModel.findById(params.id)
  }

  @Flow(verifyUser)
  @Patch('/:id')
  async UpdateMessage(
    @Body({ required: true }) { text }: MessageText,
    @Params() params: MongoId
  ) {
    await MessageModel.findByIdAndUpdate(params.id, { text })
    return MessageModel.findById(params.id)
  }
}
