import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Post,
  Put,
  State,
} from 'amala'
import { Context } from 'vm'
import { DocumentType } from '@typegoose/typegoose'
import { Message, MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import { internal } from '@hapi/boom'
import MessageData from '@/validators/MessageData'
import authUser from '@/middleware/authUser'
import checkAuthorship from '@/middleware/checkAuthorship'

@Controller('/message')
@Flow(authUser)
export default class MessageController {
  @Post('/create')
  createMessage(
    @Body({ required: true }) { text }: MessageData,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ author, text })
  }

  @Get('/')
  getAllMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author })
  }

  @Get('/:id')
  @Flow(checkAuthorship)
  getMessageById(@State('message') message: Message) {
    return message
  }

  @Put('/:id')
  @Flow(checkAuthorship)
  updateMessage(
    @Body({ required: true }) { text }: MessageData,
    @Ctx() ctx: Context,
    @State('message') message: DocumentType<Message>
  ) {
    message.text = text
    message
      .save()
      .then((result) => {
        return result
      })
      .catch(() => {
        throw ctx.throw(
          internal('Message saving failed. Please consider trying again...')
        )
      })
  }

  @Delete('/:id')
  @Flow(checkAuthorship)
  deleteMessageById(@State('message') message: Message) {
    return MessageModel.deleteOne({ message })
  }

  @Delete('/')
  deleteAllMessagesForUser(@CurrentUser() author: User) {
    return MessageModel.deleteMany({ author })
  }
}
