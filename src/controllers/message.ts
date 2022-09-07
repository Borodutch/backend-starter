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
import { auth } from '@/middleware/auth'
import MessageId from '@/validators/MessageId'
import MessageText from '@/validators/MessageText'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Post('/')
  async addMessage(
    @CurrentUser({ required: true }) author: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    const result = await MessageModel.create({ text, author })
    return result
  }

  @Put('/:id')
  async updateMessage(
    @CurrentUser({ required: true }) author: User,
    @Params({ required: true }) { id }: MessageId,
    @Body({ required: true }) { text }: MessageText
  ) {
    const result = await MessageModel.findOneAndUpdate({ id, author }, { text })
    return result
  }

  @Delete('/:id')
  async deleteMessage(
    @CurrentUser({ required: true }) author: User,
    @Params({ required: true }) { id }: MessageId
  ) {
    const result = await MessageModel.findOneAndDelete({ id, author })
    return result
  }

  @Get('/')
  async displayMessages(@CurrentUser({ required: true }) author: User) {
    const result = await MessageModel.find({ author })
    return result
  }
}
