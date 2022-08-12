import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Patch,
  Post,
} from 'amala'
import { MessageModel } from '@/models/Message'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/User'
import { notFound } from '@hapi/boom'
import MessageValid from '@/validators/MessageValid'
import authMiddleware from '@/middleware/authMiddleware'

@Controller('/message')
@Flow(authMiddleware)
export default class MessageController {
  @Post('/create')
  create(
    @Body({ required: true }) { text }: MessageValid,
    @CurrentUser() author: Ref<User>
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/')
  getAllMessage() {
    return MessageModel.find()
  }

  @Get('/:id')
  getMessageById(@Params('id') id: string) {
    return MessageModel.findById(id)
  }

  @Delete('/:id')
  async deleteMessageById(@Params('id') id: string) {
    await MessageModel.findByIdAndDelete(id)
    return 'The message has been deleted'
  }

  @Patch('/:id')
  UpdMessage(@Params('id') id: string, @Body() { text }: MessageValid) {
    return MessageModel.findByIdAndUpdate(id, { text })
  }
}
