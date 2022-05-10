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
import { Context } from 'koa'
import { User, findOrCreateUser } from '@/models/User'
import CreateMessagesInput from '@/validators/CreateMessagesInput'
import MessagesId from '@/validators/MessagesId'
import MessagesModel from '@/models/messages'
import verifyToken from '@/middleware/verifyToken'

@Controller('/messages')
@Flow(verifyToken)
export default class MessagesController {
  @Get('/:id')
  getMessagesById(@Params() { id }: MessagesId) {
    return MessagesModel.findOne({ id })
  }

  @Post('/')
  createMessages(
    @Body({ required: true }) { text }: CreateMessagesInput,
    @CurrentUser() author: User
  ) {
    return MessagesModel.create({ text, author })
  }

  @Patch('/:id')
  updateMessage(
    @Params() id: MessagesId,
    @Body({ required: true }) { text }: CreateMessagesInput,
    @CurrentUser() { name }: User
  ) {
    const currentUser = findOrCreateUser({ name })
    return MessagesModel.findByIdAndUpdate(id, { text, author: currentUser })
  }

  @Delete('/:id')
  deleteMessages(@Ctx() ctx: Context, @CurrentUser() { name }: User) {
    return ctx.state.message.delete()
  }
}
