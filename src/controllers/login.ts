import { Body, Controller, Ctx, Post, Get } from 'amala'
import { Context } from 'koa'
import { findOrCreateUser } from '@/models/user'
import { forbidden } from '@hapi/boom'
import { verifyTelegramPayload } from '@/helpers/verifyTelegramPayload'
import FacebookLogin from '@/validators/FacebookLogin'
import GoogleLogin from '@/validators/GoogleLogin'
import TelegramLogin from '@/validators/TelegramLogin'
import getFBUser from '@/helpers/getFBUser'
import getGoogleUser from '@/helpers/getGoogleUser'
import EmailLogin from '@/validators/EmailLogin'

@Controller('/login')
export default class LoginController {
  @Get('/email')
  async getemallogin()
  {
    return "TESTS EMAIL LOGIN GET"
  }
  @Post('/email')
  async email(@Ctx() ctx:Context,
    @Body({required : true}) body: EmailLogin ,
    @Body({required: true}) {name, email} : EmailLogin){ 
    console.log("EMAIL")
    const {doc} = await findOrCreateUser({
      name: ctx.request.body.name,
      email: ctx.request.body.email
    })
    ctx.cookies.set('jwt', doc.token)
    return doc.strippedAndFilled({withExtra:true})
  }
  @Post('/facebook')
  async facebook(@Body({ required: true }) { accessToken }: FacebookLogin) {
    const { name, email, id } = await getFBUser(accessToken)
    const { doc } = await findOrCreateUser({
      name,
      email,
      facebookId: id,
    })
    return doc.strippedAndFilled({ withExtra: true })
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
    const { doc } = await findOrCreateUser({
      name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
      telegramId: id,
    })
    return doc.strippedAndFilled({ withExtra: true })
  }

  @Post('/google')
  async google(@Body({ required: true }) { accessToken }: GoogleLogin) {
    const userData = await getGoogleUser(accessToken)
    const { doc } = await findOrCreateUser({
      name: userData.name,
      email: userData.email,
    })
    return doc.strippedAndFilled({ withExtra: true })
  }
}
