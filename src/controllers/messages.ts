import { Context } from 'koa';
import { Controller, Ctx, Post, Get, Put, Delete } from 'koa-ts-controllers';
import {
  addMessage,
  deleteMessage,
  updateMessage,
  getMessages,
  getMessage,
} from '@/models/message';

@Controller('/messages')
export default class LoginController {
  @Get('/')
  async getMessages() {
    return await getMessages();
  }

  @Get('/:id')
  async getMessage(@Ctx() ctx: Context) {
    return await getMessage(ctx.params.id);
  }

  @Post('/')
  async addMessage(@Ctx() ctx: Context) {
    const data = ctx.request.body;
    return await addMessage(data.message);
  }

  @Put('/')
  async updateMessage(@Ctx() ctx: Context) {
    const data = ctx.request.body;
    return await updateMessage(data.id, data.message);
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context) {
    return await deleteMessage(ctx.params.id);
  }
}
