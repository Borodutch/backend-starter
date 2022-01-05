import { Body, Controller, Ctx, Delete, Flow, Get, Params, Post } from 'amala'
import { Context } from 'koa'
import { MessageId, MessageText } from '@/validators/MessageValidators'
import { MessageModel } from '@/models/message'
import { forbidden, notFound } from '@hapi/boom'
import attachUser from '@/middleware/attachUser'

@Controller('/messages')
@Flow(attachUser)
export default class MessageController {
  @Get('/')
  async getAllMessages() {
    return await MessageModel.find()
  }

  @Get('/:id')
  async getMessage(@Ctx() ctx: Context, @Params() { id }: MessageId) {
    const message = await MessageModel.findById(id)
    if (!message) {
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
      userId: ctx.state.user._id,
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
    if (!message) {
      return ctx.throw(notFound("This message doesn't exist"))
    }
    if (ctx.state.user._id.toString() != message?.userId?.toString()) {
      return ctx.throw(
        forbidden(
          'You have no access to this message. Users can edit or delete only their own messages'
        )
      )
    }

    message.text = text
    await message.save()
    return message
  }

  @Delete('/:id')
  async deleteMsg(@Ctx() ctx: Context, @Params() { id }: MessageId) {
    const message = await MessageModel.findById(id)
    if (!message) {
      return ctx.throw(notFound("This message doesn't exist"))
    }
    if (ctx.state.user._id.toString() != message?.userId?.toString()) {
      return ctx.throw(
        forbidden(
          'You have no access to this message. Users can edit or delete only their own messages'
        )
      )
    }

    await MessageModel.findByIdAndRemove(id)
    return `You've deleted message ${id}`
  }
}
