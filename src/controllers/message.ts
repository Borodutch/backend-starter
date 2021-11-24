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
    @CurrentUser() { name }: User
  ) {
    return new MessageModel({ author: name, text }).save()
  }

  @Delete('/:id')
  @Flow([checkUser])
  async deleteMessage(
    @Params() params: MongoIdMessage,
    @CurrentUser() { name }: User
  ) {
    await MessageModel.findOneAndDelete({ author: name, _id: params.id })
    return {
      message: 'message deleted',
    }
  }

  @Put('/:id')
  @Flow([checkUser])
  updateMessage(
    @Params() params: MongoIdMessage,
    @Body({ required: true }) body: TextMessage,
    @CurrentUser() { name }: User
  ) {
    return MessageModel.findOneAndUpdate(
      { author: name, _id: params.id },
      body,
      {
        new: true,
      }
    )
  }
}
