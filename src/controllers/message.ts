import { Body, Controller, Delete, Get, Params, Patch, Post } from 'amala'
import { User, findOrCreateUser } from '@/models/User'
import {
  createNewMessage,
  findAllMessagesByUser,
  findAndDeleteMessage,
  findAndUpdateMessage,
  findMessage,
} from '@/models/Message'
import ValidId from '@/validators/MessageId'
import ValidMessage from '@/validators/Message'
import ValidUser from '@/validators/UserId'

@Controller('/message')
export default class MessageController {
  @Get('/:id')
  getMessage(@Params('id') _id: ValidId['_id']) {
    return findMessage(_id)
  }

  @Get('/allMsgByUser/:name')
  async getAllMessages(@Params('name') { name }: ValidUser) {
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
    // return message
  }

  @Patch('/:id')
  updateMessage(
    @Params('id') _id: ValidId['_id'],
    @Body({ required: true }) { data }: ValidMessage,
    @Body({ required: true }) { name }: ValidUser
  ) {
    return findAndUpdateMessage({
      text: data,
      _id: _id,
      name: name ? name : undefined,
    })
    // const new_msg = await findMessage(msg._id)
    // return msg
  }

  @Delete('/:id')
  deleteMessage(@Params('id') _id: ValidId['_id']) {
    return findAndDeleteMessage(_id)
  }
}
