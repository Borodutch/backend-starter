import {
  Body,
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Post,
  Put,
} from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { authVerify } from '@/middleware/auth'
import { authorCheck } from '@/middleware/authorCheck'
import { Ref } from '@typegoose/typegoose'
import { User } from '@/models/user'

@Controller('/message')
@Flow(authVerify)
export default class MessageController {
  @Get('/')
  async showMessages(@Ctx() ctx: Context) {
    return await MessageModel.find({})
  }

  @Post('/add')
  async addMessage(
    @Ctx() ctx: Context,
    @CurrentUser() user: Ref<User>,
    @Body('message') message: string
  ) {
    return await MessageModel({
      author: user,
      text: message,
    }).save()
  }

  @Delete('/:id')
  async deleteMessage(
    @Ctx() ctx: Context,
    @Params('id') id_: string,
    @CurrentUser() user: Ref<User>
  ) {
    if (await authorCheck(id_, user)) {
      return await MessageModel.findByIdAndDelete(id_, (err) => {
        if (err) console.log(err)
      })
    }
    return ctx.throw(403, 'Only author can delete this message')
  }

  @Put('/:id')
  async editMessage(
    @Ctx() ctx: Context,
    @Params('id') id_: string,
    @CurrentUser() user: Ref<User>,
    @Body('message') message: string
  ) {
    if (await authorCheck(id_, user)) {
      return await MessageModel.findByIdAndUpdate(id_, {
        text: message,
      })
    }
    return ctx.throw(403, 'Only author can edit this message')
  }
}
