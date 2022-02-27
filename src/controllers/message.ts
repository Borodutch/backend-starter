import { Body, Controller, Delete, Get, Params, Patch, Post } from 'amala'
import {
  createNewMessage,
  findAndDeleteMessage,
  findAndUpdateMessage,
  findMessage,
} from '@/models/Message'
import Message from '@/validators/Message'
// import MessageId from '@/validators/MessageId'

@Controller('/message')
export default class MessageController {
  @Get('/:id')
  async getMessage(@Params('id') _id: string) {
    // TODO: { _id }: MessageId ?
    // console.log(_id)
    const message = await findMessage({ _id })
    return message
  }

  @Post('/')
  async createMessage(@Body({ required: true }) { data, user_id }: Message) {
    const message = await createNewMessage({
      messageData: data,
      user_id: user_id,
    })
    return message
  }

  @Patch('/:id')
  async updateMessage(
    @Params('id') _id: string, // TODO: { _id }: MessageId ?
    @Body({ required: true }) { data, user_id }: Message
  ) {
    // console.log(_id + ' ' + data + ' ' + user_id)
    const msg = await findAndUpdateMessage({
      messageData: data,
      _id: _id,
      user_id: user_id ? user_id : undefined,
    })
    const new_msg = await findMessage({ _id: msg._id })
    return new_msg
  }

  @Delete('/:id')
  deleteMessage(@Params('id') _id: string) {
    return findAndDeleteMessage({ _id })
  }
}
