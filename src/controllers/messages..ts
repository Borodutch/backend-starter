import { Context } from 'koa';
import { Controller, Ctx, Post, Get, Params, Delete, Body } from 'amala';

interface backResponce {
  message?: string;
  id?: number;
  body?: object;
}

@Controller('/api')
export default class MessageController {
  
  @Get('/message')
  async getMessages() {
    const result: backResponce = {
      message: 'Show all messages'
    };
    return result;
  }

  @Post('/message')
  async createMessage(@Ctx() ctx: Context) {
    const result: backResponce = {
      message: 'Create a new message',
      body: ctx.request.body,
    };
    return result;
  }

  @Get('/message/:id')
  async getMessageById(@Params('id') id: number) {
    const result: backResponce = {
      id: id,
      message: 'Show message with id',
    };
    return result;
  }

  @Post('/message/:id')
  async updateMessageById(@Ctx() ctx: Context, @Params('id') id: number) {
    const result: backResponce = {
      id: id,
      message: 'Update message with id',
      body: ctx.request.body,
    };
    return result;
  }

  @Delete('/message/:id')
  async deleteMessage(@Params('id') id: number) {
    const result: backResponce = {
      id: id,
      message: 'Delete message with id',
    };
    return result;
  }
}
