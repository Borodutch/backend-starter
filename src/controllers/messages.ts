import { Context } from 'koa';
import { MessageModel } from '@/models/message';
import {
  Controller,
  Ctx,
  Req,
  Body,
  Get,
  Post,
  Delete,
  Query,
  Flow,
  Params,
  Version,
  CurrentUser,
} from 'koa-ts-controllers';
import { verify } from '@/helpers/jwt';
import { DocumentType } from '@typegoose/typegoose';
import { User, UserModel } from '@/models/user';
import { result } from 'lodash';

@Controller('/messages')
export default class MessageController {
  // Add new message
  @Post('/messageCreate')
  async messageCreate(@Ctx() ctx: Context) {
    const data = ctx.request.body;

    let user: DocumentType<User> | undefined;
    let tokenParts = ctx.request.headers.authorization.split(' ');
    const payload: any = await verify(tokenParts[1]);

    if (!payload) {
      return ctx.throw(403);
    } else {
      user = await UserModel.findOne({ email: payload.email });
      data.userId = user._id;
      const newMessage = await new MessageModel(data).save();
      return newMessage;
    }
  }

  // List of all messages
  @Get('/messagesList')
  async messagesList(@Ctx() ctx: Context) {
    let user: DocumentType<User> | undefined;
    let tokenParts = ctx.request.headers.authorization.split(' ');
    const payload: any = await verify(tokenParts[1]);

    if (!payload) {
      return ctx.throw(403);
    } else {
      user = await UserModel.findOne({ email: payload.email });
      const msgList: any = await MessageModel.find({ userId: user._id });
      return msgList;
    }
  }

  // Read (find) message by ID
  @Get('/:id')
  async messageRead(@Params() params: any, @Ctx() ctx: Context) {
    let user: DocumentType<User> | undefined;
    let tokenParts = ctx.request.headers.authorization.split(' ');
    const payload: any = await verify(tokenParts[1]);

    if (!payload) {
      return ctx.throw(403);
    } else {
      user = await UserModel.findOne({ email: payload.email });
      const id = params.id;
      const msg: any = await MessageModel.findById(id);

      if (msg.userId == user._id) {
        return msg;
      } else {
        return ctx.throw(403);
      }
    }
  }

  // Update message by ID
  @Post('/:id')
  async messageUpdate(@Params() params: any, @Ctx() ctx: Context) {
    let user: DocumentType<User> | undefined;
    let tokenParts = ctx.request.headers.authorization.split(' ');
    const payload: any = await verify(tokenParts[1]);

    if (!payload) {
      return ctx.throw(403);
    } else {
      user = await UserModel.findOne({ email: payload.email });
      const id = params.id;
      const msg: any = await MessageModel.findById(id);

      if (msg.userId == user._id) {
        const data = ctx.request.body;
        return await MessageModel.findByIdAndUpdate(id, data, { new: true });
      } else {
        return ctx.throw(403);
      }
    }
  }

  // Delete message by ID
  @Delete('/:id')
  async messageDelete(@Params() params: any, @Ctx() ctx: Context) {
    let user: DocumentType<User> | undefined;
    let tokenParts = ctx.request.headers.authorization.split(' ');
    const payload: any = await verify(tokenParts[1]);

    if (!payload) {
      return ctx.throw(403);
    } else {
      user = await UserModel.findOne({ email: payload.email });
      const id = params.id;
      const msg: any = await MessageModel.findById(id);

      if (msg.userId == user._id) {
        return await MessageModel.findByIdAndDelete(id);
      } else {
        return ctx.throw(403);
      }
    }
  }
}
