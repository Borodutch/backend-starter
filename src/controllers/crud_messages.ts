import { Context } from 'koa'
import {
  Controller,
  Ctx,
  CurrentUser,
  Delete,
  Flow,
  Get,
  Params,
  Patch,
  Post,
  Query,
} from 'amala'
import { MessageModel } from '@/models/message'
import { ObjectId } from 'mongoose'
import { User } from '@/models/User'
import { UserModel } from '@/models/user'
import { badRequest, notFound } from '@hapi/boom'
import emailMiddleware from '@/middlewares/email'

@Controller('/messages')
export default class {
  @Get('/')
  async findAllMessages(@Ctx() ctx: Context) {
    const messages = await MessageModel.find()
    if (!messages) {
      return ctx.throw(notFound())
    }
    return messages
  }

  @Get('/users')
  async findAllUsers(@Ctx() ctx: Context) {
    const users = await UserModel.find()
    if (!users) {
      return ctx.throw(notFound())
    }
    return users
  }

  @Get('/user/:token')
  async findUserByToken(@Ctx() ctx: Context, @Params('token') token: string) {
    const user = await UserModel.findOne({ token })
    if (!user) {
      return ctx.throw(notFound())
    }
    return user
  }

  @Get('/:id')
  async findMessageById(@Params('id') id: ObjectId, @Ctx() ctx: Context) {
    const message = await MessageModel.findById(id)
    if (!message) {
      return ctx.throw(notFound())
    }
    return message
  }

  @Post('/create')
  @Flow(emailMiddleware)
  async createMessage(
    @Ctx() ctx: Context,
    @Query('author') author: string,
    @Query('text') text: string,
    @CurrentUser() currentUser: User //ctx.state.user
  ) {
    if (currentUser.name === author) {
      //if ctx.state.user !== @Query('author') => throw an error
      return await MessageModel.create({
        author,
        text,
      })
    } else {
      return ctx.throw(badRequest())
    }
  }

  @Patch('/update/:id')
  async updateMsgById(
    @Ctx() ctx: Context,
    @Params('id') id: ObjectId,
    @Query('author') author?: string,
    @Query('text') messageText?: string
  ) {
    const updMessage = await MessageModel.findByIdAndUpdate(
      id,
      { author: author, messageText: messageText },
      { new: true }
    )
    if (!updMessage) {
      return ctx.throw(notFound())
    }
    return updMessage
  }

  @Delete('/delete/:id')
  async deleteMsgById(@Params('id') id: ObjectId, @Ctx() ctx: Context) {
    const delMessage = await MessageModel.findByIdAndDelete(id)
    if (!delMessage) {
      return ctx.throw(notFound())
    }
    return delMessage
  }
}
