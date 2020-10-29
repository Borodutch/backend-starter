import { Context, Response } from 'koa';
import { Controller, Delete, Get, Post, Patch, Body, Ctx, Flow, Params } from 'koa-ts-controllers';
import { Message, MessageModel } from '../models/message';
import { verify } from '../helpers/jwt'
import { getOrCreateUser, LoginOptions } from '../models/user'

async function authMiddleware(ctx: Context, next) {
  /* 
    В кач-ве Authorization-Header'а с клиента должен отправляться JWT, 
    который перед этим был отправлен при успешном POST на /login
  */
  const token = ctx.headers['authorization']

  if (!token) {
    return ctx.throw(401, 'You\'re not logged in')
  }
  
  try {
    const payload = await verify(token) as LoginOptions

    const { name, email, facebookId, telegramId } = payload

    ctx.state.user = await getOrCreateUser({ name, email, facebookId, telegramId})

    await next()
  } catch (err) {
    return ctx.throw(err)
  }  
}

@Controller('/messages')
export default class MessagesController {

  @Get('/')
  @Flow(authMiddleware)
  async getMessages(@Ctx() ctx: Context) {
    const user = ctx.state.user

    try {
      const userMessages = await MessageModel.find({ user: user._id })
      return userMessages
    } catch (error) {
      return ctx.throw(400, 'Failed to read messages')
    }
  }

  @Post('/')
  @Flow(authMiddleware)
  async addMessage(
    @Body('body') body: string,
    @Ctx() ctx: Context,
  ) {
    const user = ctx.state.user

    try {
      const message = await MessageModel.create({ 
        body,
        user: user._id
      })

      return message
    } catch (error) {
      return ctx.throw(400, 'Failed to add message')
    }
  }

  @Delete('/:id')
  @Flow(authMiddleware)
  async deleteMessage(
    @Params('id') id: string,
    @Ctx() ctx: Context
  ) {
    const user = ctx.state.user

    try {
      const message = await MessageModel.findOneAndDelete({
        _id: id,
        user: user._id,
      })

      ctx.status = 200
    } catch (error) {
      return ctx.throw(400, 'Failed to delete message')
    }
  }

  @Patch('/:id')
  @Flow(authMiddleware)
  async updateMessage(
    @Params('id') id: string,
    @Body('body') newMessageBody: string,
    @Ctx() ctx: Context
  ) {
    const user = ctx.state.user

    try {
      const message = await MessageModel.findOneAndUpdate({
        _id: id,
        user: user._id,
      }, {
        body: newMessageBody
      })

      ctx.status = 200
    } catch (error) {
      return ctx.throw(400, 'Failed to edit message')
    }
  }
  
}