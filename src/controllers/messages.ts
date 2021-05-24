import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Flow,
  Ctx,
} from 'koa-ts-controllers'
import authMiddleware from '@/middleware/authMiddleware'
import { MessageModel } from '@/models/message'
import { Context } from 'koa'

@Controller('/messages')
@Flow([authMiddleware])
export default class MessagesController {
  @Get('/')
  async listMessages(@Ctx() ctx: Context) {
    return MessageModel.find({ authorId: ctx.state.user._id })
  }

  @Post('/')
  async postMessage(@Ctx() ctx: Context) {
    const message = await new MessageModel({
      authorId: ctx.state.user._id,
      content: ctx.request.body.content,
    }).save()
    return {
      response: 'message posted',
      message,
    }
  }

  @Put('/')
  async updateMessage(@Ctx() ctx: Context) {
    const originalMessage = await MessageModel.findOneAndUpdate(
      {
        _id: ctx.request.body._id,
        authorId: ctx.state.user._id,
      },
      {
        $set: {
          content: ctx.request.body.content,
        },
      }
    )

    return {
      response: 'message updated',
      originalMessage,
    }
  }

  @Delete('/')
  async deleteMessage(@Ctx() ctx: Context) {
    await MessageModel.deleteOne({ _id: ctx.request.body._id })
  }
}
