import { MessageModel } from '@/models/message'
import { UserModel } from '@/models/user'
import { Context } from 'koa'
import {
  Controller,
  Ctx,
  Get,
  Post,
  Put,
  Delete,
  Flow,
} from 'koa-ts-controllers'
import { authMiddleware } from '@/middlewares/authMiddleware'

@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getAllMessages(@Ctx() ctx: Context) {
    if (typeof ctx.headers.token !== 'string') {
      return ctx.throw(401, 'Invalid token')
    }
    const user = await UserModel.findOne({
      token: ctx.headers.token,
    })
    const result = await MessageModel.find({ author: user }).sort({
      createdAt: -1,
    })
    return result
  }

  @Get('/:id')
  @Flow(authMiddleware)
  async getOneMessage(@Ctx() ctx: Context) {
    const result = await MessageModel.findById(ctx.params.id)
    return result
  }

  @Post('/add')
  async postMessage(@Ctx() ctx: Context, next) {
    if (typeof ctx.headers.token !== 'string') {
      return ctx.throw(401, 'Invalid token')
    }
    const user = await UserModel.findOne({
      token: ctx.headers.token,
    })
    const message = await new MessageModel({
      author: user,
      title: ctx.request.body.title,
      body: ctx.request.body.body,
    }).save()
  }

  @Put('/:id')
  @Flow(authMiddleware)
  async putMessage(@Ctx() ctx: Context) {
    const message = await MessageModel.findById(ctx.params.id)
    await message.updateOne({
      title: ctx.request.body.title,
      body: ctx.request.body.body,
    })
  }

  @Delete('/:id')
  @Flow(authMiddleware)
  async deleteMessage(@Ctx() ctx: Context) {
    const message = await MessageModel.findById(ctx.params.id)
    await MessageModel.deleteOne(message)
  }
}
