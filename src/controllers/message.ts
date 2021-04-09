import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Ctx,
  Body,
  Flow,
  Params,
} from 'koa-ts-controllers'
import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { authMiddleware } from '@/middleware/middleware'

@Controller('/message')
export default class MessageController {
  @Post('/')
  @Flow(authMiddleware)
  async createMessage(@Body('body') body: string, @Ctx() ctx: Context) {
    const user = ctx.state.user
    try {
      const message = await MessageModel.create({
        body: body,
        user: user._id,
      })
      return message
    } catch (error) {
      return ctx.throw(500, 'Failed to add message')
    }
  }

  @Get('/')
  @Flow(authMiddleware)
  async getMessages(@Ctx() ctx: Context) {
    const user = ctx.state.user
    try {
      const userMessages = await MessageModel.find({ user: user._id })
      return userMessages
    } catch (error) {
      return ctx.throw(500, 'Failed to read messages')
    }
  }

  @Delete('/:id')
  @Flow(authMiddleware)
  async deleteMessage(@Params('id') id: string, @Ctx() ctx: Context) {
    const user = ctx.state.user
    try {
      const message = await MessageModel.findOneAndDelete({
        _id: id,
        user: user._id,
      })
      ctx.status = 200
    } catch (error) {
      return ctx.throw(500, 'Failed to delete message')
    }
  }

  @Put('/:id')
  @Flow(authMiddleware)
  async updateMessage(
    @Params('id') id: string,
    @Body('body') newMessageBody: string,
    @Ctx() ctx: Context
  ) {
    const user = ctx.state.user
    try {
      const message = await MessageModel.findOneAndUpdate(
        {
          _id: id,
          user: user._id,
        },
        {
          body: newMessageBody,
        }
      )
      ctx.status = 200
    } catch (error) {
      return ctx.throw(500, 'Failed to edit message')
    }
  }
}
