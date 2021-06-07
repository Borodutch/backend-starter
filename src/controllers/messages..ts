import { Context } from 'koa';
import { Controller, Ctx, Post, Get, Params, Delete, Body } from 'amala';
import { Message, MessageModel, } from '@/models/message';
import { DocumentType } from '@typegoose/typegoose';

interface backResponce {
  message?: any;
  id?: number;
  body?: object;
}

@Controller('/api')
export default class MessageController {
  
  @Get('/message')
  async getMessages() {
    const msg: DocumentType<Message>[] = await MessageModel.find()

    const result: backResponce = {
      message: msg
    };
    return result;
  }

  @Post('/message')
  async createMessage(@Ctx() ctx: Context) {
    let text = 'NEW LINERR'
    let msg: DocumentType<Message> = await MessageModel.create({ name: 'SomeCat', message: text })

    const result: backResponce = {
      message: msg,
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
