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
import { authenticate } from '@/middlewares/authenticate'
import { checkAuthor, getMessage } from '@/middlewares/message'
import MessageText from '@/validators/MessageText'
import ObjectIdParam from '@/validators/ObjectIdParam'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Get('/')
  async getMessages(@CurrentUser() user: User) {
    return await MessageModel.find({ author: user })
  }

  @Get('/:id')
  async getMessageDetails(
    @Params('id') id: ObjectIdParam,
    @CurrentUser() user: User
  ) {
    return await MessageModel.findOne({ _id: id, author: user })
  }

  // eslint-disable-next-line require-await
  @Post('/')
  async createMessage(
    @CurrentUser() author: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    return new MessageModel({ text, author }).save()
  }

  @Put('/:id')
  @Flow([getMessage, checkAuthor])
  async updateMessage(
    @State('message') message: Message,
    @Body({ required: true }) { text }: MessageText
  ) {
    return await MessageModel.findOneAndUpdate(message, { text })
  }

  @Delete('/:id')
  @Flow([getMessage, checkAuthor])
  async messageDelete(@State('message') message: Message) {
    return await MessageModel.findOneAndRemove(message)
  }
}
