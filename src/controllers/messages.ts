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
import { Message, MessagesModel } from '@/models/MessagesModel'
import { User } from '@/models/User'
import MessageContentPayload from '@/validators/MessageContentPayload'
import checkToken from '@/middleware/checkToken'
import checkUser from '@/middleware/checkUser'

@Controller('/messages')
@Flow(checkToken)
export default class MessageController {
  @Post('/')
  createMessage(
    @CurrentUser() author: User,
    @Body({ required: true }) payload: MessageContentPayload
  ) {
    return MessagesModel.create({ text: payload.text, author })
  }

  @Put('/:id')
  @Flow(checkUser)
  updateMessage(
    @Body({ required: true }) { text }: MessageContentPayload,
    @State('message') message: Message
  ) {
    const updatedMessage = MessagesModel.findByIdAndUpdate(message, { text })
    return updatedMessage
  }

  @Flow(checkUser)
  @Delete('/:id')
  deleteMessage(@State('message') messages: Message) {
    return MessagesModel.findByIdAndDelete(messages)
  }

  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return MessagesModel.find({ author })
  }
}
