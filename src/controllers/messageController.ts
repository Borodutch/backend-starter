import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
  State,
} from 'amala'
import { DocumentType } from '@typegoose/typegoose'
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import MessageBody from '@/validators/MessageBody'
import authenticate from '@/middlewares/authenticate'
import checkAuthor from '@/middlewares/checkAuthor'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Post('/')
  async sendMessage(
    @Body({ required: true }) { text }: MessageBody,
    @CurrentUser() author: DocumentType<User>
  ) {
    return await MessageModel.create({ author, text })
  }

  @Get('/')
  async getAllMessages(@CurrentUser() author: DocumentType<User>) {
    return await MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow(checkAuthor)
  getOneMessage(@State('message') message: DocumentType<Message>) {
    return message
  }

  @Put('/:id')
  @Flow(checkAuthor)
  async updateMessage(
    @Body({ required: true }) { text }: MessageBody,
    @State('message') message: DocumentType<Message>
  ) {
    message.text = text
    return await message.save()
  }

  @Delete('/:id')
  @Flow(checkAuthor)
  async deleteMessage(@State('message') message: DocumentType<Message>) {
    return await message.delete()
  }
}
