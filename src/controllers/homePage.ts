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
import { DocumentType } from '@typegoose/typegoose'
import { User } from '@/models/User'
import { messageModel } from '@/models/messageModel'
import MessageBody from '@/validators/MessageBody'
import authenticate from '@/middlewares/authenticate'

@Controller('/homePage')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  async PostMessage(
    @CurrentUser() author: DocumentType<User>,
    @Body({ required: true }) { text }: MessageBody
  ) {
    return await messageModel.create({ author, text })
  }
  @Get('/')
  getMessages() {
    const user = messageModel.find({})
    return user
  }
  @Delete('/:id')
  deleteMessage(@Params('id') id: any) {
    const user = messageModel.findByIdAndDelete(id)
    return user
  }
  @Put('/:id')
  updateMessage(
    @Params('id') id: any,
    @Body({ required: true }) { text }: MessageBody
  ) {
    return messageModel.findByIdAndUpdate(id, { text })
  }
}
