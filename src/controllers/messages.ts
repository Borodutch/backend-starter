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
  async postMessage(
    @Body({ required: true }) { message }: Message,
    @CurrentUser() user: User
  ) {
    return await new MessageModel({ message, user }).save()
  }

  @Get('/:id')
  @Flow(checkUser)
  async getMessage(
    @Params() { id }: MongoId,
    @Body({ required: true }) { message }: Message,
    @CurrentUser() user: User
  ) {
    return await MessageModel.find({ id, message, user })
  }

  @Put('/:id')
  @Flow(checkUser)
  async editMessage(@Params() { id }: MongoId) {
    return await MessageModel.updateOne({ id })
  }

  @Delete('/:id')
  @Flow(checkUser)
  async deleteMessage(@Params() { id }: MongoId) {
    await MessageModel.findByIdAndDelete({ id })
    return { success: true }
  }
}
