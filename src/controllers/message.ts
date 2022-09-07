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
  addMessage(
    @CurrentUser() author: User,
    @Body({ required: true }) { text }: MessageText
  ) {
    return MessageModel.create({ text, author })
  }

  @Put('/:id')
  updateMessage(
    @CurrentUser() author: User,
    @Params({ required: true }) { id }: MessageId,
    @Body({ required: true }) { text }: MessageText
  ) {
    return MessageModel.findOneAndUpdate({ id, author }, { text })
  }

  @Delete('/:id')
  deleteMessage(
    @CurrentUser() author: User,
    @Params({ required: true }) { id }: MessageId
  ) {
    return MessageModel.findOneAndDelete({ id, author })
  }

  @Get('/')
  displayMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }
}
