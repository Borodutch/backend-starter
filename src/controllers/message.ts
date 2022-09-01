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
import { Message, MessageModel } from '@/models/MessageModel'
import { User } from '@/models/User'
import checkMessage from '@/middlewares/checkMessage'
import checkUser from '@/middlewares/checkUser'

@Controller('/crud')
@Flow(checkUser)
export default class MessageController {
  @Get('/')
  getMessage(@CurrentUser() messageAuthor: User) {
    return MessageModel.find({ messageAuthor })
  }

  @Post('/')
  postMessage(
    @CurrentUser() messageAuthor: User,
    @Body({ required: true }) text: string
  ) {
    return new MessageModel({ text, messageAuthor }).save()
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
