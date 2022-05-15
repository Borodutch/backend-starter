import {
  Body,
  Controller,
  Delete,
  Flow,
  Get,
  Params,
  Patch,
  Post,
  State,
} from 'amala'
import {
  MessageModel,
  createNewMessage,
  findAllMessagesByUser,
  findAndDeleteMessage,
  findAndUpdateMessage,
} from '@/models/Message'
import { findOrCreateUser } from '@/models/User'
import UserVerify from '@/middleware/UserVerify'
import ValidMessage from '@/validators/Message'
import ValidUser from '@/validators/User'

@Controller('/message')
export default class MessageController {
  @Flow(UserVerify)
  // @Get('/')
  @Get('/:name')
  // async getAllMessages(@Params('name') name: ValidUser['name']) {
  //   const currentUser = await findOrCreateUser({ name })
  getAllMessages(@State('user') user: ValidUser) {
    return findAllMessagesByUser(user)
  }

  @Flow(UserVerify)
  @Post('/:name')
  createMessage(
    @Body({ required: true }) { text }: ValidMessage,
    // @Body({ required: true }) { name }: ValidUser
    @State('user') user: ValidUser
  ) {
    // const currentUser = await findOrCreateUser({ name })
    return createNewMessage(text, user)
  }

  @Flow(UserVerify)
  @Patch('/:id')
  async updateMessage(
    @Params('id') messageId: ValidMessage['_id'],
    @Body({ required: true }) { text }: ValidMessage,
    @Body({ required: true }) { name }: ValidUser
  ) {
    const currentUser = await findOrCreateUser({ name })
    await findAndUpdateMessage(messageId, currentUser, text)
    return await MessageModel.findOne({ name: name, _id: messageId })
  }

  @Flow(UserVerify)
  @Delete('/:id')
  deleteMessage(@Params('id') messageId: ValidMessage['_id']) {
    return findAndDeleteMessage(messageId)
  }
}
