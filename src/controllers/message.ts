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
import { MessageModel } from '@/models/message'
import { User } from '@/models/user'
import MongoIdMessage from '@/validators/MongoIdMessage'
import TextMessage from '@/validators/TextMessage'
import auth from '@/middleware/auth'
import checkUser from '@/middleware/checkUser'

@Controller('/message')
@Flow(auth)
export default class MessageController {
  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Post('/')
  addMessage(
    @Body({ required: true }) { text }: TextMessage,
    @CurrentUser() author: User
  ) {
    return new MessageModel({ author, text }).save()
  }

  @Delete('/:id')
  @Flow([checkUser])
  async deleteMessage(
    @Params() { id }: MongoIdMessage,
    @CurrentUser() author: User
  ) {
    await MessageModel.findOneAndDelete({ id, author })
  }

  @Put('/:id')
  @Flow([checkUser])
  updateMessage(
    @Params() { id }: MongoIdMessage,
    @Body({ required: true }) body: TextMessage,
    @CurrentUser() author: User
  ) {
    return MessageModel.findOneAndUpdate({ id, author }, body, {
      new: true,
    })
  }
}
