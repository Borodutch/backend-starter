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
import { User } from '@/models/user'
import Message from '@/validators/Message'
import MongoId from '@/validators/MongoId'
import auth from '@/middlewares/auth'
import checkUser from '@/middlewares/checkUser'

@Controller('/message')
@Flow(auth)
export default class messageController {
  @Post('/')
  postMessage(
    @Body({ required: true }) { text }: Message,
    @CurrentUser() user: User
  ) {
    return MessageModel.create({ text, user })
  }

  @Get('/:id')
  @Flow(checkUser)
  getMessage(@Params() { id }: MongoId, @CurrentUser() user: User) {
    return MessageModel.findOne({ id, user })
  }

  @Put('/:id')
  @Flow(checkUser)
  editMessage(@Ctx() ctx: Context, @Body() { text }: Message) {
    ctx.state.message.text = text
    return ctx.state.message.update()
  }

  @Delete('/:id')
  @Flow(checkUser)
  deleteMessage(@Ctx() ctx: Context) {
    return ctx.state.message.delete()
  }
}
