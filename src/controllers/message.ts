import { Body, Controller, Delete, Get, Params, Patch, Post } from 'amala'
import {
  MessageModel,
  createNewMessage,
  findAllMessagesByUser,
  findAndDeleteMessage,
  findAndUpdateMessage,
} from '@/models/Message'
import { findOrCreateUser } from '@/models/User'
import ValidId from '@/validators/MessageId'
import ValidMessage from '@/validators/Message'
import ValidUser from '@/validators/UserId'

@Controller('/message')
export default class MessageController {
  @Get('/:name')
  async getAllMessages(@Params('name') name: ValidUser['name']) {
    const currUser = await findOrCreateUser({ name })
    return findAllMessagesByUser(currUser)
  }

  @Post('/')
  async createMessage(
    @Body({ required: true }) { data }: ValidMessage,
    @Body({ required: true }) { name }: ValidUser
  ) {
    const currUser = await findOrCreateUser({ name })
    return createNewMessage({
      text: data,
      user: currUser,
    })
  }

  @Patch('/:id')
  async updateMessage(
    @Params('id') _id: ValidId['_id'],
    @Body({ required: true }) { data }: ValidMessage,
    @Body({ required: true }) { name }: ValidUser
  ) {
    const currUser = await findOrCreateUser({ name })
    await findAndUpdateMessage(
      {
        _id,
        user: currUser,
      },
      { text: data }
    )
    return await MessageModel.findOne({ name: name, _id: _id })
  }

  @Delete('/:id')
  deleteMessage(@Params('id') _id: ValidId['_id']) {
    return findAndDeleteMessage(_id)
  }
}
