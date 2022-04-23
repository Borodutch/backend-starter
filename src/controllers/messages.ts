import {
  Body,
  Controller,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Patch,
  Post,
} from 'amala'
import { User, findOrCreateUser } from '@/models/User'
import CreateMessagesInput from '@/validators/CreateMessagesInput'
import MessagesId from '@/validators/MessagesId'
import MessagesModel from '@/models/messages'
import verifyToken from '@/middleware/verifyToken'

@Controller('/messages')
export default class MessagesContrroller {
  @Get('/:id')
  getMessagesById(@Params() id: MessagesId) {
    return MessagesModel.findById(id)
  }

  @Post('/')
  @Flow([verifyToken])
  createMessages(
    @Body({ required: true }) { text }: CreateMessagesInput,
    @CurrentUser() { name }: User
  ) {
    const currentUser = findOrCreateUser({ name })
    return MessagesModel.create({ message: text, author: currentUser })
  }

  @Patch('/:id')
  @Flow([verifyToken])
  updateMessage(
    @Params() id: MessagesId,
    @Body({ required: true }) { text }: CreateMessagesInput,
    @CurrentUser() { name }: User
  ) {
    const currentUser = findOrCreateUser({ name })
    return MessagesModel.findByIdAndUpdate(id, { text, author: currentUser })
  }

  @Delete('/:id')
  @Flow([verifyToken])
  deleteMessages(@Params() id: MessagesId, @CurrentUser() { name }: User) {
    const currentUser = findOrCreateUser({ name })
    return MessagesModel.findByIdAndDelete(id, { author: currentUser })
  }
}
