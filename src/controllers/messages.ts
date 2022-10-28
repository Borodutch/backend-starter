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
import { MessagesModel } from '@/models/MessagesModel'
import { User } from '@/models/User'
import DocumentId from '@/validators/DocumentId'
import MessageContentPayload from '@/validators/MessageContentPayload'
import checkToken from '@/middleware/checkToken'

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
  async updateMessage(
    @Params('id') id: DocumentId,
    @Body({ required: true }) payload: MessageContentPayload
  ) {
    const updatedMessage = await MessagesModel.findByIdAndUpdate(id, {
      text: payload.text,
    })
    return await MessagesModel.findById(updatedMessage)
  }

  @Delete('/:id')
  deleteMessage(@Params('id') id: DocumentId) {
    return MessagesModel.findByIdAndDelete(id)
  }

  @Get('/')
  getMessages(@CurrentUser() author: User) {
    return MessagesModel.find({ author })
  }
}
