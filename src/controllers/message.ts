import { Body, Controller, Delete, Get, Params, Patch, Post } from 'amala'
import {
  createNewMessage,
  // findAllMessagesByUserId,
  findAndDeleteMessage,
  findAndUpdateMessage,
  findMessage,
} from '@/models/Message'
import ValidId from '@/validators/MessageId'
import ValidMessage from '@/validators/Message'

@Controller('/message')
export default class MessageController {
  @Get('/:id')
  getMessage(@Params('id') _id: ValidId['_id']) {
    return findMessage(_id)
  }

  // @Get('/allMsgByUser/:userId')
  // getAllMessages(@Params('UserId') userId: ValidMessage['userId']) {
  //   return findAllMessagesByUserId(userId)
  // }

  @Post('/')
  async createMessage(
    @Body({ required: true }) { data, userId }: ValidMessage
  ) {
    const message = await createNewMessage({
      text: data,
      userId: userId,
    })
    return message
  }

  @Patch('/:id')
  async updateMessage(
    @Params('id') _id: ValidId['_id'],
    @Body({ required: true }) { data, userId }: ValidMessage
  ) {
    const msg = await findAndUpdateMessage({
      text: data,
      _id: _id,
      userId: userId ? userId : undefined,
    })
    const new_msg = await findMessage(msg._id)
    return new_msg
  }

  @Delete('/:id')
  deleteMessage(@Params('id') _id: ValidId['_id']) {
    return findAndDeleteMessage(_id)
  }
}
