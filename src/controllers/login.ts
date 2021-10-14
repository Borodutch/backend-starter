import * as Facebook from 'facebook-node-sdk'
import { Body, Controller, Ctx, Post } from 'amala'
import { Context } from 'koa'
import {
  TelegramLoginPayload,
  verifyTelegramPayload,
} from '@/helpers/verifyTelegramPayload'
import { forbidden } from '@hapi/boom'
import { getOrCreateUser } from '@/models/user'
import FBUser from '@/models/FBUser'
import axios from 'axios'

@Controller('/login')
export default class LoginController {
  @Post('/facebook')
  async facebook(@Body('accessToken') accessToken: string) {
    const fbProfile: FBUser = await getFBUser(accessToken)
    const user = await getOrCreateUser({
      name: fbProfile.name,

      email: fbProfile.email,
      facebookId: fbProfile.id,
    })
    return user.strippedAndFilled(true)
  }

  @Post('/telegram')
  async telegram(@Ctx() ctx: Context, @Body() data: TelegramLoginPayload) {
    // verify the data
    if (!verifyTelegramPayload(data)) {
      return ctx.throw(forbidden())
    }

    const user = await getOrCreateUser({
      name: `${data.first_name}${data.last_name ? ` ${data.last_name}` : ''}`,
      telegramId: data.id,
    })
    return user.strippedAndFilled(true)
  }

  @Post('/google')
  async google(@Body('accessToken') accessToken: string) {
    const userData =
      process.env.TESTING === 'true'
        ? testingGoogleMock()
        : (
            await axios(
              `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`
            )
          ).data

    const user = await getOrCreateUser({
      name: userData.name,

      email: userData.email,
    })
    return user.strippedAndFilled(true)
  }

  @Post('/email')
  async email(@Body('name') name: string, @Body('email') email: string) {
    const user = await getOrCreateUser({ name, email })
    return user.strippedAndFilled(true)
  }
}

function getFBUser(accessToken: string): Promise<FBUser> {
  return new Promise((res, rej) => {
    const fb = new Facebook({
      appID: process.env.FACEBOOK_APP_ID,
      secret: process.env.FACEBOOK_APP_SECRET,
    })
    fb.setAccessToken(accessToken)
    fb.api('/me?fields=name,email,id', (err, user) => {
      return err ? rej(err) : res(user)
    })
  })
}

function testingGoogleMock() {
  return {
    name: 'Alexander Brennenburg',
    email: 'alexanderrennenburg@gmail.com',
  }
}
