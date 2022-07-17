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
import {
  MessageModel,
  createNewMessage,
  findAllMessagesByUser,
  findAndDeleteMessage,
  findAndUpdateMessage,
} from '@/models/Message'
import { User } from '@/models/User'
import UserVerify from '@/middleware/UserVerify'
import ValidMessage from '@/validators/Message'

@Controller('/message')
export default class MessageController {
  @Flow(UserVerify)
  @Get('/')
  getAllMessages(@CurrentUser() user: User) {
    return findAllMessagesByUser(user)
  }

  @Flow(UserVerify)
  @Post('/')
  createMessage(
    @Body({ required: true }) text: ValidMessage['text'],
    @CurrentUser() user: User
  ) {
    return createNewMessage(text, user)
  }

  @Flow(UserVerify)
  @Patch('/:id')
  async updateMessage(
    @Params('id') _id: ValidMessage['_id'],
    @Body({ required: true }) text: ValidMessage['text'],
    @CurrentUser() user: User
  ) {
    await findAndUpdateMessage(_id, user, text)
    return await MessageModel.findOne({ user, _id })
  }

  @Flow(UserVerify)
  @Delete('/:id')
  deleteMessage(
    @Params('id') _id: ValidMessage['_id'],
    @CurrentUser() user: User
  ) {
    return findAndDeleteMessage(_id, user)
  }
}
