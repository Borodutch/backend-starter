import axios from 'axios'
import { Context } from 'koa'
import { getOrCreateUser } from '@/models/user'
import { Controller, Ctx, Post, Get, Put, Delete, Flow } from 'amala'
import Facebook = require('facebook-node-sdk')
import { verifyTelegramPayload } from '@/helpers/verifyTelegramPayload'
const Blog = require('../models/message.js');
import { MessageModel as Message } from '@/models/message'
import * as mongoose from 'mongoose';
import {userAuth} from '@/middleware/auth'

@Controller('/crud')
@Flow(userAuth)
export default class CrudController {

  @Get('/:id')
  async getMessage(@Ctx() ctx: Context)  {
    return await Message
      .findOne({
        _id: ctx.params.id,
        user_id: ctx.state.user._id,
      })
      .exec()
  }

  @Get('/')
  async getMessageByUser(@Ctx() ctx: Context)  {
    return await Message.find({
      user_id: ctx.state.user._id,
      })
      .exec();
  }

  @Post('/')
  async createMessage(@Ctx() ctx: Context)  {
    const newMessage = new Message({
      user_id: ctx.state.user.id,
      text: ctx.request.body.text || ''
    });
    await newMessage.save();
    return {status:"ok", id: newMessage._id}
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context)  {
    const ret = await Message.findOneAndDelete({
      _id: ctx.params.id,
      user_id: ctx.state.user._id, 
    })
    .exec()
    return ret || ["Message not found"]
  }

  @Put('/:id')
  async updateMessage(@Ctx() ctx: Context)  {
    const message = await Message.findOneAndUpdate({
      _id: ctx.params.id,
      user_id: ctx.state.user._id,
    }, {text: ctx.request.body.text})
    .exec()
    return message || ["Message not found"];
  }
}
