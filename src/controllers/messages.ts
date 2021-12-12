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
import Message from '@/validators/Message'
import MongoId from '@/validators/MongoId'
import auth from '@/middlewares/auth'
import checkUser from '@/middlewares/checkUser'

@Controller('/message')
@Flow(auth)
export default class messageController {
  @Post('/')
  postMessage(
    @Body({ required: true }) { text }: Message,
    @CurrentUser() user: User
  ) {
    return new MessageModel({ text, user }).save()
  }

  @Get('/:id')
  @Flow(checkUser)
  getMessage(@Params() { id }: MongoId) {
    return MessageModel.find({ id })
  }

  @Put('/:id')
  @Flow(checkUser)
  editMessage(@Params() { id }: MongoId) {
    return MessageModel.updateOne({ _id: id })
  }

  @Delete('/:id')
  @Flow(checkUser)
  async deleteMessage(@Params() { id }: MongoId, @CurrentUser() user: User) {
    await MessageModel.findByIdAndDelete({ _id: id, user: user })
    return { success: true }
  }
}
