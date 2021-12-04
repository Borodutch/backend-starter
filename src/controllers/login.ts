import { Body, Controller, Ctx, Post } from 'amala'
import { Context } from 'koa'
import { findOrCreateUser } from '@/models/user'
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
    const { name, email, id } = await getFBUser(accessToken)
    const { doc: user } = await findOrCreateUser({
      name,
      email,
      facebookId: id,
    })
    return user.strippedAndFilled({ withExtra: true })
  }

  @Post('/telegram')
  async telegram(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: TelegramLogin,
    @Body({ required: true }) { first_name, last_name, id }: TelegramLogin
  ) {
    if (!verifyTelegramPayload(body)) {
      return ctx.throw(forbidden())
    }
    const { doc: user } = await findOrCreateUser({
      name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
      telegramId: id,
    })
    return user.strippedAndFilled({ withExtra: true })
  }

  @Post('/google')
  async google(@Body({ required: true }) { accessToken }: GoogleLogin) {
    const userData = await getGoogleUser(accessToken)
    const { doc: user } = await findOrCreateUser({
      name: userData.name,
      email: userData.email,
    })
    return user.strippedAndFilled({ withExtra: true })
  }

  @Post('/email')
  async email(
    @Body({ required: true }) email: string,
    @Body({ required: true }) name: string
  ) {
    console.log(name, email)
    const user = await findOrCreateUser({
      name,
      email,
    })
    return user
  }
}
