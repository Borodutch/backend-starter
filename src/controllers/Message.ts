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
import { User } from '@/models/User'
import Message from '@/validators/Message'
import ID from '@/validators/ID'
import MessageModel from '@/models/Message'
import auth from '@/middleware/auth'
import security from '@/middleware/security'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Get('/')
  async getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Post('/')
  async createMessages(
    @CurrentUser() author: User,
    @Body({ required: true }) { text }: Message
  ) {
    return new MessageModel({ text, author }).save()
  }

  @Put('/:id')
  @Flow(security)
  async updateMessages(
    @Body({ required: true }) { text }: Message,
    @Params() { id }: ID
  ) {
    return MessageModel.findOneAndUpdate({ _id: id }, { text })
  }

  @Delete('/:id')
  @Flow(security)
  async deleteMessages(@Params() { id }: ID) {
    return MessageModel.findByIdAndDelete(id)
  }
}
