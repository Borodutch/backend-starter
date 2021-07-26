import axios from 'axios'
import { Context } from 'koa'
import { UserModel as User } from '@/models/user'
import {
  Controller,
  Ctx,
  Post,
  Get,
  Put,
  Delete,
  Flow,
  Params,
  CurrentUser,
  Body,
} from 'amala'
import Facebook = require('facebook-node-sdk')
import { verifyTelegramPayload } from '@/helpers/verifyTelegramPayload'
import { MessageModel as Message } from '@/models/message'
import * as mongoose from 'mongoose'
import { userAuth } from '@/middleware/auth'
import { MessageChannel } from 'worker_threads'

@Controller('/crud')
@Flow(userAuth)
export default class CrudController {
  @Get('/:id')
  async getMessage(@Params('id') id: any, @CurrentUser() user) {
    return Message.findOne({
      _id: id,
      user: user,
    }).exec()
  }

  @Get('/')
  async getMessageByUser(@CurrentUser() user) {
    return Message.find({
      user: user,
    }).exec()
  }

  @Post('/')
  async createMessage(@CurrentUser() user, @Body('text') text: any) {
    const newMessage = new Message({
      user: user,
      text: text,
    })
    await newMessage.save()
    return { status: 'ok', id: newMessage._id }
  }

  @Delete('/:id')
  async deleteMessage(
    @Ctx() ctx: Context,
    @Params('id') id: any,
    @CurrentUser() user
  ) {
    const ret = await Message.findOneAndDelete({
      _id: id,
      user: user,
    }).exec()
    if (!ret) {
      return ctx.throw(404)
    }
    return ret
  }

  @Put('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Params('id') id: any,
    @CurrentUser() user,
    @Body('text') text: any
  ) {
    const message = Message.findOneAndUpdate(
      {
        _id: id,
        user: user,
      },
      { text: text }
    ).exec()
    if (!message) {
      return ctx.throw(404)
    }
    return message
  }
}
