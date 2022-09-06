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
} from 'amala'
import { MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageId from '@/validators/MessageId'
import MessageText from '@/validators/MessageText'
import auth from '@/middleware/auth'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Post('/')
  async addMessage(
    @CurrentUser({ required: true }) author: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    return await (await MessageModel.create({ text, author })).save()
  }

  @Put('/:id')
  async updateMessage(
    @Params('id') { id }: MessageId,
    @Body({ required: true }) { text }: MessageText
  ) {
    return await MessageModel.findByIdAndUpdate(id, { text })
  }

  @Delete('/:id')
  async deleteMessage(@Params('id') { id }: MessageId) {
    return await MessageModel.findByIdAndDelete(id)
  }

  @Get('/')
  async displayMessages(@CurrentUser({ required: true }) author: User) {
    return await MessageModel.find({ author })
  }
}
