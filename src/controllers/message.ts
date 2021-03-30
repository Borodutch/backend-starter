import { MessageModel } from '@/models/message'
import { UserModel } from '@/models/user'
import { Context } from 'koa'
import { Controller, Ctx, Get, Post, Put, Delete } from 'koa-ts-controllers'

@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getAllMessages(@Ctx() ctx: Context) {
    try {
      let result = await MessageModel.find().sort({ createdAt: -1 })
      ctx.res.end(JSON.stringify(result))
    } catch (err) {
      console.log(err)
    }
  }

  @Get('/:id')
  async getOneMessage(@Ctx() ctx: Context) {
    try {
      let result = await MessageModel.findById(ctx.params.id)
      ctx.res.end(JSON.stringify(result))
    } catch (err) {
      console.log(err)
    }
  }

  @Post('/add')
  async postMessage(@Ctx() ctx: Context) {
    try {
      const user = await UserModel.findOne({
        token: ctx.headers.token.toString(),
      })
      const message = await new MessageModel({
        author: user,
        title: ctx.request.body.title,
        body: ctx.request.body.body,
      }).save()
    } catch (err) {
      console.log(err)
    }
  }

  @Put('/:id')
  async putMessage(@Ctx() ctx: Context) {
    try {
      const message = await checkAuth(
        ctx.headers.token.toString(),
        ctx.params.id
      )
      await message.updateOne({
        title: ctx.request.body.title,
        body: ctx.request.body.body,
      })
    } catch (err) {
      console.log(err)
    }
  }

  @Delete('/:id')
  async deleteMessage(@Ctx() ctx: Context) {
    try {
      const message = await checkAuth(
        ctx.headers.token.toString(),
        ctx.params.id
      )
      await MessageModel.deleteOne(message)
    } catch (err) {
      console.log(err)
    }
  }
}

async function checkAuth(token: string, messageId: string) {
  const user = await UserModel.findOne({ token: token })
  const message = await MessageModel.findById(messageId)
  if (user.token === message.author.token) {
    return message
  } else {
    throw 'invalid auth'
  }
}
