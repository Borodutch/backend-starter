import { Context } from 'koa';
import { Controller, Ctx, Post, Get, Params, Delete, Body } from 'amala';
import { Message, MessageModel, } from '@/models/message';
import { DocumentType } from '@typegoose/typegoose';

const CURREN_USER_NAME = 'user'

@Controller('/api')
export default class MessageController {
  
  @Get('/message')
  async getMessages() {
    const filter = {name : CURREN_USER_NAME}
    const msg: DocumentType<Message>[] = await MessageModel.find(filter)
    return msg;
  }

  @Post('/message')
  async createMessage(@Ctx() ctx: Context) {
    const doc = ctx.request.body.doc
    const msg: DocumentType<Message> = await MessageModel.create(doc)

    return msg;
  }

  @Get('/message/:id')
  async getMessageById(@Params('id') id: string) {
    const filter = {_id : id, name : CURREN_USER_NAME}
    const msg: DocumentType<Message> = await MessageModel.findOne(filter)
    return msg;
  }

  @Post('/message/:id')
  async updateMessageById(@Ctx() ctx: Context, @Params('id') id: string) {
    const filter = {_id : id, name : CURREN_USER_NAME}
    const doc = ctx.request.body.doc
    let msg: DocumentType<Message> = await MessageModel.findOneAndUpdate(filter, doc)
    msg  = await MessageModel.findOne(filter)
    return msg;
  }

  @Delete('/message/:id')
  async deleteMessage(@Params('id') id: string) {
    const filter = {_id : id, name : CURREN_USER_NAME}
    const msg: DocumentType<Message> = await MessageModel.findOneAndDelete(filter)
    return msg;
  }
}
