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
} from 'amala'
import { MessageModel } from '@/models/message'
import { authVerify } from '@/middleware/auth'
import { authorCheck } from '@/middleware/authorCheck'
import { User } from '@/models/user'
import { Context } from 'koa'

@Controller('/message')
@Flow(authVerify)
export default class MessageController {
  @Get('/')
  async showMessages(@CurrentUser() author: User) {
    return await MessageModel.find({ author })
  }

  @Post('/')
  async addMessage(@CurrentUser() author: User, @Body('text') text: string) {
    return await MessageModel({ author, text }).save()
  }

  @Delete('/:id')
  @Flow(authorCheck)
  async deleteMessage(@Ctx() ctx: Context) {
    return await MessageModel.deleteOne(ctx.state.message)
  }

  @Put('/:id')
  @Flow(authorCheck)
  async editMessage(@Ctx() ctx: Context, @Body('text') text: string) {
    return await MessageModel.updateOne(ctx.state.message, { text })
  }
}
