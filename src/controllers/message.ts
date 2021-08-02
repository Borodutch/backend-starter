import { authorCheck } from '@/middleware/authorCheck'
import { authVerify } from '@/middleware/auth'
import { MessageModel } from '@/models/message'
import { User } from '@/models/user'
import { Context } from 'koa'
import {
  Controller,
  Ctx,
  Get,
  Post,
  Put,
  Delete,
  Body,
  CurrentUser,
  Flow,
} from 'amala'

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

  @Flow(authorCheck)
  @Put('/:id')
  async editMessage(@Ctx() ctx: Context, @Body('text') text: string) {
    return await MessageModel.updateOne(ctx.state.message, { text })
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context) {
    return await MessageModel.deleteOne(ctx.state.message)
  }
}
