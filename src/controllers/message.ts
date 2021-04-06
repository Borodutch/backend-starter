import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Ctx,
  Body,
  Flow,
  Params,
} from 'koa-ts-controllers'
import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { getOrCreateUser, User } from '@/models/user'
import { verify } from '@/helpers/jwt'

async function authMiddleware(ctx: Context, next) {
  const token = ctx.headers['authorization']

  if (!token) {
    return ctx.throw(401, "You're not logged in")
  }
  try {
    const payload = (await verify(token)) as User

    const { name, email, facebookId, telegramId } = payload

    ctx.state.user = await getOrCreateUser({
      name,
      email,
      facebookId,
      telegramId,
    })

    await next()
  } catch (err) {
    return ctx.throw(err)
  }
}

@Controller('/message')
export default class MessageController {
  @Post('/save')
  @Flow(authMiddleware)
  async createMessage(@Body('body') body: string, @Ctx() ctx: Context) {
    const user = ctx.state.user
    try {
      const message = await MessageModel.create({
        body: body,
        user: user._id,
      })
      console.log(message.user)
      return message
    } catch (error) {
      return ctx.throw(400, 'Failed to add message')
    }
  }

  @Get('/read')
  @Flow(authMiddleware)
  async getMessages(@Ctx() ctx: Context) {
    const user = ctx.state.user.id
    try {
      const userMessages = await MessageModel.find({ user: user._id })
      return userMessages
    } catch (error) {
      return ctx.throw(400, 'Failed to read messages')
    }
  }

  @Delete('/del/:id')
  @Flow(authMiddleware)
  async deleteMessage(@Params('id') id: string, @Ctx() ctx: Context) {
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

  @Put('/upd/:id')
  @Flow(authMiddleware)
  async updateMessage(
    @Params('id') id: string,
    @Body('body') newMessageBody: string,
    @Ctx() ctx: Context
  ) {
    const user = ctx.state.user
    try {
      const message = await MessageModel.findOneAndUpdate(
        {
          _id: id,
          user: user._id,
        },
        {
          body: newMessageBody,
        }
      )
      ctx.status = 200
    } catch (error) {
      return ctx.throw(400, 'Failed to edit message')
    }
  }
}
