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
import { Context } from 'vm'
import { IdValid, TextValid } from '@/validators/MessageValidator'
import { MessageModel } from '@/models/Message'
import { User } from '@/models/User'
import { forbidden } from '@hapi/boom'
import tokenMiddleware from '@/helpers/tokenMiddleware'

@Controller('/messages')
@Flow(tokenMiddleware)
export default class MessageController {
  @Post('/')
  async createMessage(
    @Body({ required: true }) { text }: TextValid,
    @CurrentUser() author: User
  ) {
    return MessageModel.create({ text, author })
  }

  @Get('/')
  async getMessages(@CurrentUser() author: User) {
    return MessageModel.find({ author: author })
  }

  @Patch('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: TextValid,
    @Params() { id }: IdValid
  ) {
    const msg = await MessageModel.findById(id)
    if (ctx.state.user.id == msg?.author) {
      return MessageModel.findByIdAndUpdate(id, { text })
    }
    return ctx.throw(forbidden('Invalid user'))
  }

  @Delete('/:id')
  async removeMessage(@Ctx() ctx: Context, @Params() { id }: IdValid) {
    const msg = await MessageModel.findById(id)
    if (ctx.state.user.id == msg?.author) {
      await MessageModel.findByIdAndDelete(id)
      return 'Message deleted'
    }
    return ctx.throw(forbidden('Invalid user'))
  }
}
