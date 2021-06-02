import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Flow,
  Ctx,
} from 'koa-ts-controllers';
import auth from '@/middleware/auth';
import { MessageModel } from '@/models/message';
import { Context } from 'koa';

@Controller('/messages')
@Flow(auth)
export default class MessagesController {
  @Get('/')
  async listMessages(@Ctx() ctx: Context) {
    return MessageModel.find({ author: ctx.state.user });
  }

  @Post('/')
  async postMessage(@Ctx() ctx: Context) {
    const message = await new MessageModel({
      author: ctx.state.user,
      content: ctx.request.body.content,
    }).save();
    return {
      response: 'message posted',
      message,
    };
  }

  @Put('/')
  async updateMessage(@Ctx() ctx: Context) {
    const message = await MessageModel.findOne({
      _id: ctx.request.body._id,
      author: ctx.state.user,
    });
    if (!message) {
      ctx.throw(404, 'Message not found');
    }

    message.content = ctx.request.body.content;
    await message.save();

    return {
      response: 'message updated',
      message,
    };
  }

  @Delete('/')
  async deleteMessage(@Ctx() ctx: Context) {
    const { deletedCount } = await MessageModel.deleteOne({
      _id: ctx.request.body._id,
      author: ctx.state.user,
    });
    if (deletedCount === 0) {
      ctx.throw(404, 'Page not found');
    }
  }
}
