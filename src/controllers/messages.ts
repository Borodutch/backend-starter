import { MessageModel } from '@/models/message'
import { auth } from '@/middlewares/auth'
import { checkMessage } from '@/middlewares/checkMessage'
import {
  Controller,
  Flow,
  Get,
  Post,
  Put,
  Delete,
  Body,
  CurrentUser,
  Ctx,
} from 'amala'
import { Context } from 'koa'

@Controller('/')
@Flow(auth)
export default class {
  @Post('/')
  async create(@Body('text') text, @CurrentUser() user, @Ctx() ctx: Context) {
    await new MessageModel({ author: user, text }).save()
    ctx.status = 200
  }

  @Get('/')
  async getAll(@CurrentUser() user) {
    const messages = await MessageModel.find({ author: user })
    return messages
  }

  @Get('/:id')
  @Flow(checkMessage)
  async getOne(@Ctx() ctx: Context) {
    return ctx.state.message
  }

  @Put('/:id')
  @Flow(checkMessage)
  async update(@Body('text') text, @Ctx() ctx: Context) {
    await MessageModel.updateOne(ctx.state.message, { text })
    ctx.status = 200
  }

  @Delete('/:id')
  @Flow(checkMessage)
  async delete(@Ctx() ctx: Context) {
    await MessageModel.deleteOne(ctx.state.message)
    ctx.status = 200
  }
}
