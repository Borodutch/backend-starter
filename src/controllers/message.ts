import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Patch,
  Post,
} from 'amala'
import { MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageText from '@/validators/MessageText'
import MongoId from '@/validators/MongoId'
import authenticate from '@/middleware/authenticate'
import checkUser from '@/middleware/checkUser'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  create(
    @Body({ required: true }) { text }: MessageText,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/')
  getAllMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow(checkUser)
  getMessageById(@Params() { id }: MongoId) {
    return MessageModel.findById(id)
  }

  @Delete('/:id')
  @Flow(checkUser)
  deleteMessageById(@Params() { id }: MongoId) {
    return MessageModel.findByIdAndDelete(id)
  }

  @Patch('/:id')
  @Flow(checkUser)
  UpdMessage(@Params() id: MongoId, @Body() { text }: MessageText) {
    return MessageModel.findByIdAndUpdate(id, { text })
  }
}
