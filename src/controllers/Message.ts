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
import { User } from '@/models/User'
import ID from '@/validators/ID'
import Message from '@/validators/Message'
import MessageModel from '@/models/Message'
import accessMessage from '@/middleware/accessMessage'
import auth from '@/middleware/auth'
import updateMessage from '@/middleware/updateMessage'

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
  @Flow([accessMessage, updateMessage])
  async updateMessages(
    @Body({ required: true }) { text }: Message,
    @State('message') message: ID
  ) {
    return MessageModel.findOneAndUpdate(
      { _id: message.id },
      { text },
      { new: true }
    )
  }

  @Delete('/:id')
  @Flow(accessMessage)
  async deleteMessages(@Params() { id }: ID) {
    return MessageModel.findByIdAndDelete(id)
  }
}
