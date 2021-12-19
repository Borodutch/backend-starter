import { Body, Controller, Ctx, Delete, Get, Post, Put } from 'amala'
import { Context } from 'koa'
import { findOrCreateUser } from '@/models/user'
import { forbidden } from '@hapi/boom'
import { verifyTelegramPayload } from '@/helpers/verifyTelegramPayload'
import { findOrCreateMessage, Message, MessageModel } from '@/models/message'
import MessageApi from '@/validators/MessageApi'

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
  //get id message - return list all
  //   @Put('/put/:id')
  //   async updateMessage(@Body({ required: true }) { id, content }: MessageApi) {
  //     const { doc } = await findOrCreateMessage({ id })
  //     return
  //   }
  @Get('/get')
  async getMessage(@Ctx() ctx: Context) {
    //const { doc } = await MessageModel.find({})
    return MessageModel.find() //doc
  }
  //   @Get('/get')
  //   async get(@Body({ required: true }) { accessToken }: FacebookLogin) {
  //     const { name, email, id } = await getFBUser(accessToken)
  //     const { doc: user } = await findOrCreateUser({
  //       name,
  //       email,
  //       facebookId: id,
  //     })
  //     return doc //user.strippedAndFilled({ withExtra: true })
  //   }

  //   @Put('/put')
  //   async updateMessage(
  //     @Ctx() ctx: Context,
  //     @Body({ required: true }) body: TelegramLogin,
  //     @Body({ required: true }) { first_name, last_name, id }: TelegramLogin
  //   ) {
  //     if (!verifyTelegramPayload(body)) {
  //       return ctx.throw(forbidden())
  //     }
  //     const { doc: user } = await findOrCreateUser({
  //       name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
  //       telegramId: id,
  //     })
  //     return user.strippedAndFilled({ withExtra: true })
  //   }

  //   @Delete('/delete')
  //   async deleteMessage(@Body({ required: true }) { accessToken }: GoogleLogin) {
  //     const userData = await getGoogleUser(accessToken)
  //     const { doc: user } = await findOrCreateUser({
  //       name: userData.name,
  //       email: userData.email,
  //     })
  //     return user.strippedAndFilled({ withExtra: true })
  //   }
}
