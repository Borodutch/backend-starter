import { Body, Controller, Ctx, Get, Post } from 'amala'
import { Context } from 'koa'
import { findOrCreateUser } from '@/models/User'
import { forbidden } from '@hapi/boom'
import { verifyTelegramPayload } from '@/helpers/verifyTelegramPayload'
import FacebookLogin from '@/validators/FacebookLogin'
import GoogleLogin from '@/validators/GoogleLogin'
import TelegramLogin from '@/validators/TelegramLogin'
import getFBUser from '@/helpers/getFBUser'
import getGoogleUser from '@/helpers/getGoogleUser'

@Controller('/login')
export default class LoginController {
  @Post('/facebook')
  async facebook(@Body({ required: true }) { accessToken }: FacebookLogin) {
    const { email, id, name } = await getFBUser(accessToken)
    const user = await findOrCreateUser({
      email,
      facebookId: id,
      name,
    })
    return user.strippedAndFilled({ withExtra: true })
  }

  @Post('/telegram')
  async telegram(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: TelegramLogin,
    @Body({ required: true }) { first_name, id, last_name }: TelegramLogin
  ) {
    if (!verifyTelegramPayload(body)) {
      return ctx.throw(forbidden())
    }
    const user = await findOrCreateUser({
      name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
      telegramId: id,
    })
    return user.strippedAndFilled({ withExtra: true })
  }

  @Post('/google')
  async google(@Body({ required: true }) { accessToken }: GoogleLogin) {
    const userData = await getGoogleUser(accessToken)
    const user = await findOrCreateUser({
      email: userData.email,
      name: userData.name,
    })
    return user.strippedAndFilled({ withExtra: true })
  }
  @Get('/test')
  async test() {
    return 'test'
  }
}
