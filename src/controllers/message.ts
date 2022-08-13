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
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'
import MessageText from '@/validators/MessageText'
import authenticate from '@/middleware/authenticate'
import check from '@/middleware/checkUser'
import mongoId from '@/validators/mongoId'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  create(
    @Body({ required: true }) { text }: MessageText,
    @CurrentUser() author: Ref<User>
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/')
  getAllMessages() {
    return MessageModel.find()
  }

  @Get('/my')
  getMyMessages(@CurrentUser() author: Ref<User>) {
    return MessageModel.find({ author })
  }

  @Flow(check)
  @Get('/:id')
  getMessageById(@Params() { id }: mongoId) {
    return MessageModel.findById(id)
  }

  @Delete('/:id')
  async deleteMessageById(@Params() { id }: mongoId) {
    return await MessageModel.findByIdAndDelete(id)
  }

  @Patch('/:id')
  UpdMessage(@Params('id') id: string, @Body() { text }: MessageText) {
    return MessageModel.findByIdAndUpdate(id, { text })
  }
}
