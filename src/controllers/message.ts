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
import { Context } from 'koa'
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import checkMessage from '@/middlewares/checkMessage'
import checkUser from '@/middlewares/checkUser'

@Controller('/crud')
@Flow(checkUser)
export default class MessageController {
  @Get('/')
  getMessage(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Post('/')
  async postMessage(
    @CurrentUser() author: User,
    @Body({ required: true }) text: string
  ) {
    return await MessageModel.create({ text, author })
  }

  @Put('/:id')
  @Flow(checkMessage)
  putMessage(
    @Body({ required: true }) text: string,
    @State('message') message: Message
  ) {
    return MessageModel.findByIdAndUpdate(message, { text })
  }

  @Delete('/:id')
  @Flow(checkMessage)
  deleteMessage(@State('message') message: Context) {
    return MessageModel.findByIdAndDelete({ _id: message.id })
  }
}
