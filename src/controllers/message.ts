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
import { serverUnavailable } from '@hapi/boom'
import MessageData from '@/validators/MessageData'
import authUser from '@/middleware/authUser'
import checkAuthorship from '@/middleware/checkAuthorship'

@Controller('/message')
@Flow(authUser)
export default class MessageController {
  @Post('/create')
  createMessage(
    @Body({ required: true }) { text }: DocumentType<MessageData>,
    @CurrentUser() author: DocumentType<User>
  ) {
    return MessageModel.create({ author, text })
  }

  @Get('/')
  getAllMessages(@CurrentUser() author: DocumentType<User>) {
    return MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow(checkAuthorship)
  getMessageById(@State('message') message: Message) {
    return message
  }

  @Put('/:id')
  @Flow(checkAuthorship)
  async updateMessage(
    @Body({ required: true }) { text }: MessageData,
    @State('message') message: DocumentType<Message>
  ) {
    message.text = text
    try {
      await message.save()
    } catch (error) {
      throw serverUnavailable(
        'The message has not been saved! Consider retrying'
      )
    }
    return message
  }

  @Delete('/:id')
  @Flow(checkAuthorship)
  async deleteMessageById(@State('message') message: DocumentType<Message>) {
    return await MessageModel.deleteOne({ id: message.id })
  }

  @Delete('/')
  async deleteAllMessagesForUser(@CurrentUser() user: DocumentType<User>) {
    return await MessageModel.deleteMany({ author: user })
  }
}
