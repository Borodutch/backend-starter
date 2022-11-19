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
import { DocumentType } from '@typegoose/typegoose'
import { Message, MessageModel } from '@/models/MessageModel'
import { User } from '@/models/User'
import Authentification from '@/middlewares/Authentification'
import MessageCheckerId from '@/middlewares/MessageChecker'
import MessageText from '@/validators/MessageText'

@Controller('/message')
@Flow(Authentification)
export default class CRUD {
  @Post('/')
  createMsg(
    @CurrentUser() user: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    return MessageModel.create({ text, user })
  }

  @Get('/')
  getMsg(@CurrentUser() user: User) {
    console.log(MessageModel.find({ user }))

    return MessageModel.find({ user })
  }

  @Get('/:id')
  @Flow(MessageCheckerId)
  getOneMsg(@State('message') message: Message) {
    return message
  }

  @Put('/:id')
  @Flow(MessageCheckerId)
  updateMsg(
    @Body({ required: true }) { text }: MessageText,
    @State('message') message: DocumentType<Message>
  ) {
    return MessageModel.findByIdAndUpdate(message.id, { text })
  }

  @Delete('/:id')
  @Flow(MessageCheckerId)
  deleteMsg(@State('message') message: DocumentType<Message>) {
    return MessageModel.findByIdAndDelete(message.id)
  }
}
