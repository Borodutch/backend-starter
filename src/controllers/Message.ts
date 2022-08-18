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
import MessageModel from '@/models/Message'
import MessageText from '@/validators/MessageText'
import MongoId from '@/validators/MongoId'
import attachMessage from '@/middleware/attachMessage'
import authenticate from '@/middleware/authenticate'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Post('/')
  createMessages(
    @CurrentUser() author: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    return MessageModel.create({ text, author })
  }

  @Put('/:id')
  @Flow(attachMessage)
  updateMessages(
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
  @Flow(attachMessage)
  deleteMessages(@Params() { id }: MongoId) {
    return MessageModel.findByIdAndDelete(id)
  }
}
