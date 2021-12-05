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
    @Body({ required: true }) { text }: Message,
    @CurrentUser() user: User
  ) {
    const newMessage = await new MessageModel({ text, user }).save()
    return newMessage
  }

  @Get('/:id')
  @Flow(checkUser)
  async getMessage(
    @Params() { id }: MongoId,
    @Body({ required: true }) { text }: Message,
    @CurrentUser() user: User
  ) {
    const foundMessage = await MessageModel.find({ id, text, user })
    return foundMessage
  }

  @Put('/:id')
  @Flow(checkUser)
  async editMessage(
    @Params() { id }: MongoId,
    @Body({ required: true }) body: Message,
    @CurrentUser() user: User
  ) {
    const editedMessage = await MessageModel.findOneAndUpdate(
      { id, user },
      body,
      {
        new: true,
      }
    )
    return editedMessage
  }

  @Delete('/:id')
  @Flow(checkUser)
  async deleteMessage(@Params() { id }: MongoId, @CurrentUser() user: User) {
    await MessageModel.findByIdAndDelete({ _id: id, user: user })
    return { success: true }
  }
}
