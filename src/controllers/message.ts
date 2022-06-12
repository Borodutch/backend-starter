import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Post,
  Put,
  State,
} from 'amala'
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import { checkAuthor, getMessage } from '@/middlewares/message'
import MessageText from '@/validators/MessageText'
import ObjectIdParam from '@/validators/ObjectIdParam'
import authenticate from '@/middlewares/authenticate'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Get('/')
  getMessages(@CurrentUser() user: User) {
    return MessageModel.find({ author: user })
  }

  @Get('/:id')
  getMessageDetails(
    @Params('id') id: ObjectIdParam,
    @CurrentUser() user: User
  ) {
    return MessageModel.findOne({ _id: id, author: user })
  }

  @Post('/')
  createMessaxge(
    @CurrentUser() author: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    return MessageModel.create({ text, author })
  }

  @Put('/:id')
  @Flow([getMessage, checkAuthor])
  updateMessage(
    @State('message') message: Message,
    @Body({ required: true }) { text }: MessageText
  ) {
    return MessageModel.findOneAndUpdate(message, { text })
  }

  @Delete('/:id')
  @Flow([getMessage, checkAuthor])
  messageDelete(@State('message') message: Message) {
    return MessageModel.findOneAndRemove(message)
  }
}
