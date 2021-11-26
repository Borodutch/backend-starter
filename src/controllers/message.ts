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
  getMessages(@CurrentUser() user: User) {
    return MessageModel.find({ author: user })
  }

  @Post('/')
  addMessage(
    @Body({ required: true }) { text }: TextMessage,
    @CurrentUser() user: User
  ) {
    return new MessageModel({ author: user, text }).save()
  }

  @Delete('/:id')
  @Flow([checkUser])
  async deleteMessage(
    @Params() params: MongoIdMessage,
    @CurrentUser() user: User
  ) {
    await MessageModel.findOneAndDelete({ author: user, _id: params.id })
  }

  @Put('/:id')
  @Flow([checkUser])
  updateMessage(
    @Params() params: MongoIdMessage,
    @Body({ required: true }) body: TextMessage,
    @CurrentUser() user: User
  ) {
    return MessageModel.findOneAndUpdate(
      { _id: params.id, author: user },
      body,
      {
        new: true,
      }
    )
  }
}
