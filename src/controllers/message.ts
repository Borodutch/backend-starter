import { Body, Controller, Ctx, Delete, Flow, Get, Params, Post } from 'amala'
import { Context } from 'koa'
import { MessageId, MessageText } from '@/validators/Message'
import { MessageModel } from '@/models/message'
import { notFound } from '@hapi/boom'
import authorize from '@/middleware/authorize'

@Controller('/messages')
@Flow(authorize)
export default class MessageController {
  @Get('/')
  getAllMessages(@Ctx() ctx: Context) {
    return MessageModel.find({ author: ctx.state.user._id })
  }

  @Get('/:id')
  async getMessage(@Ctx() ctx: Context, @Params() { id }: MessageId) {
    const message = await MessageModel.findById(id)
    if (
      !message ||
      ctx.state.user._id.toString() != message?.author?.toString()
    ) {
      return ctx.throw(notFound("Can't find message with this id"))
    }

    return message
  }

  @Post('/')
  async postMessage(
    @Ctx() ctx: Context,
    @Body({ required: true }) { text }: MessageText
  ) {
    const message = await MessageModel.create({
      author: ctx.state.user._id,
      text,
    })
    return message
  }

  @Post('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Params() { id }: MessageId,
    @Body({ required: true }) { text }: MessageText
  ) {
    const message = await MessageModel.findById(id)
    if (
      !message ||
      ctx.state.user._id.toString() != message?.author?.toString()
    ) {
      return ctx.throw(notFound("Can't find message with this id"))
    }

    message.text = text
    await message.save()
    return message
  }

  @Delete('/:id')
  async deleteMsg(@Ctx() ctx: Context, @Params() { id }: MessageId) {
    const message = await MessageModel.findById(id)
    if (
      !message ||
      ctx.state.user._id.toString() != message?.author?.toString()
    ) {
      return ctx.throw(notFound("Can't find message with this id"))
    }

    await MessageModel.findByIdAndRemove(id)
    return `You've deleted message ${id}`
  }
}
