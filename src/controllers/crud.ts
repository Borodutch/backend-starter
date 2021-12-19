import { Body, Controller, Ctx, Delete, Get, Params, Post, Put } from 'amala'
import { Context } from 'koa'
import { findOrCreateUser } from '@/models/user'
import { forbidden } from '@hapi/boom'
import { verifyTelegramPayload } from '@/helpers/verifyTelegramPayload'
import { findOrCreateMessage, Message, MessageModel } from '@/models/message'
import MessageApi from '@/validators/MessageApi'
import PutUpdateMessage from '@/validators/PutMessageApi'
import { Ref } from '@typegoose/typegoose'
import ParamsOptions from '@/validators/Param'

@Controller('/message')
export default class MessageController {
  @Post('/post')
  async postMessage(@Body({ required: true }) { name, content }: MessageApi) {
    const { doc } = await findOrCreateMessage({
      name,
      content,
    })
    return doc
  }
  @Get('/get')
  async getMessage(@Ctx() ctx: Context) {
    return MessageModel.find()
  }
  @Put('/put/:id')
  async updateMessage(
    @Params('id') _id: string,
    @Body('content') content: string
  ) {
    return MessageModel.findByIdAndUpdate({ _id }, { content })
  }
  @Delete('/delete/:id')
  async deleteMessage(
    @Params('id') _id: string
    //@Body('content') content: string// postdel not found
  ) {
    return MessageModel.findByIdAndDelete({ _id })
  }
}
