import {
  Body,
  Controller,
  Ctx,
  Delete,
  Flow,
  Get,
  Params,
  Post,
  Put,
} from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/Message'
import { ObjectId } from 'mongoose'
import { UserModel } from '@/models/User'
import { authenticate } from '@/middlewares/authenticate'
import MessageText from '@/validators/MessageText'

@Controller('/message')
@Flow(authenticate)
export default class MessageController {
  @Get('/')
  async messageIndex() {
    const messages = await MessageModel.find().sort({ createdAt: -1 })
    return messages
  }

  @Get('/:id')
  async messageDetails(@Params('id') id: ObjectId) {
    const message = await MessageModel.findById(id)
    return message
  }

  @Post('/')
  async messageCreate(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: MessageText
  ) {
    const author = await UserModel.findById(ctx.state.user.id)
    const message = new MessageModel({
      text: text,
      author: author,
    })
    await message.save()
    return message
  }

  @Put('/:id')
  async messageUpdate(
    @Ctx() ctx: Context,
    @Params('id') id: ObjectId,
    @Body({ required: true }) { text }: MessageText
  ) {
    const message = await MessageModel.findById(id)
    if (!message) {
      return ctx.throw(404, 'Message not found')
    }
    const user = ctx.state.user
    const author = await UserModel.findById(message.author)

    if (author && user._id.toString() !== author._id.toString()) {
      console.log(author._id)

      return ctx.throw(403, "You can't modify message")
    }
    message.text = text
    await message.save()
    return message
  }

  @Delete('/:id')
  async messageDelete(@Ctx() ctx: Context, @Params('id') id: ObjectId) {
    const message = await MessageModel.findById(id)
    if (!message) {
      return ctx.throw(404, 'Message not found')
    }
    const user = ctx.state.user
    const author = await UserModel.findById(message.author)

    if (author && user._id.toString() !== author._id.toString()) {
      return ctx.throw(403, "You can't modify message")
    }
    await MessageModel.findByIdAndDelete(id)
  }
}
