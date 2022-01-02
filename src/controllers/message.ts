import { Body, Controller, Ctx, Delete, Get, Header, Params, Post } from 'amala'
import { Context } from 'koa'
import { MessageModel } from '@/models/message'
import { UserModel } from '@/models/user'
import { badRequest, forbidden, notFound } from '@hapi/boom'
import { mongoose } from '@typegoose/typegoose'

@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getAllMessages() {
    const messages = await MessageModel.find()
    return messages
  }

  @Get('/:id')
  async getMessage(@Ctx() ctx: Context, @Params('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      ctx.throw(badRequest('Message id MUST BE ObjectId type'))

    const message = await MessageModel.findById(id)
    if (!message) ctx.throw(notFound("Can't find message with this id"))

    return message
  }

  @Post('/')
  async postMessage(
    @Ctx() ctx: Context,
    @Header('user_id') userId: string,
    @Body({ required: true }) { text }: { text: string }
  ) {
    if (!mongoose.Types.ObjectId.isValid(userId))
      ctx.throw(badRequest('UserId MUST BE ObjectId type'))

    const userExists = await UserModel.exists({ _id: userId })
    if (!userExists)
      ctx.throw(
        forbidden("User with this id doesn't exist: you can't post message")
      )

    const message = await MessageModel.create({ userId, text })
    return message
  }

  @Post('/:id')
  async updateMessage(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @Header('user_id') userId: string,
    @Body({ required: true }) { new_message_text }: { new_message_text: string }
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      ctx.throw(badRequest('Message id MUST BE ObjectId type'))
    if (typeof userId == 'undefined')
      ctx.throw(badRequest('You need to provide author user id'))

    const message = await MessageModel.findById(id)
    if (!message) ctx.throw(notFound("This message doesn't exist"))

    if (message?.userId?.toString() != userId)
      ctx.throw(
        forbidden(
          'You have no access to this message. Users can edit or delete only their own messages'
        )
      )
    if (!new_message_text)
      ctx.throw(
        badRequest(
          "You NEED TO provide a new message text. Use 'new_message_text' key to provide a new message text"
        )
      )

    message.text = new_message_text
    await message.save()
    return message
  }

  @Delete('/:id')
  async deleteMsg(
    @Ctx() ctx: Context,
    @Params('id') id: string,
    @Header('user_id') userId: string
  ) {
    if (!mongoose.Types.ObjectId.isValid(id))
      ctx.throw(badRequest('Message id MUST BE ObjectId type'))
    if (typeof userId == 'undefined')
      ctx.throw(badRequest('You need to provide author user id'))

    const message = await MessageModel.findById(id)
    if (!message) ctx.throw(notFound("This message doesn't exist"))
    if (message?.userId?.toString() != userId)
      ctx.throw(
        forbidden(
          'You have no access to this message. Users can edit or delete only their own messages'
        )
      )

    await MessageModel.findByIdAndRemove(id)
    return `You've deleted message ${id}`
  }
}
