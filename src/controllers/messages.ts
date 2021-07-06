import { MessageModel } from '@/models/message'
import { auth, check } from '@/controllers/middlewares/auth'
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
  async create(@Body('text') text, @CurrentUser() user, @Ctx() ctx) {
    await new MessageModel({ author: user, text }).save()
    ctx.status = 200
  }

  @Get('/')
  async getAll(@CurrentUser() user) {
    const messages = await MessageModel.find({ author: user })
    return messages
  }

  @Get('/:id')
  @Flow(check)
  async getOne(@Ctx() ctx) {
    const message = await MessageModel.findOne({ _id: ctx.state.message._id })
    return message
  }

  @Put('/:id')
  @Flow(check)
  async update(@Body('text') text, @Ctx() ctx: Context) {
    await MessageModel.findOneAndUpdate(
      { _id: ctx.state.message._id },
      { text }
    )
    ctx.status = 200
  }

  @Delete('/:id')
  @Flow(check)
  async delete(@Ctx() ctx: Context) {
    await MessageModel.findOneAndDelete({ _id: ctx.state.message._id })
    ctx.status = 200
  }
}
