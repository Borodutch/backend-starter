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
import { Context } from 'koa'
import { User } from '@/models/User'
import MongoId from '@/validators/MongoId'
import MessageText from '@/validators/MessageText'
import MessageModel from '@/models/Message'
import accessMessage from '@/middleware/accessMessage'
import attachMessage from '@/middleware/attachMessage'
import authenticate from '@/middleware/authenticate'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Get('/')
  async getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Post('/')
  async createMessages(
    @CurrentUser() author: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    return new MessageModel({ text, author }).save()
  }

  @Put('/:id')
  @Flow([accessMessage, attachMessage])
  async updateMessages(
    @Body({ required: true }) { text }: MessageText,
    @State('message') message: Context
  ) {
    return MessageModel.findOneAndUpdate(
      { _id: message.id },
      { text },
      { new: true }
    )
  }

  @Delete('/:id')
  @Flow(accessMessage)
  async deleteMessages(@Params() { id }: MongoId) {
    return MessageModel.findByIdAndDelete(id)
  }
}
