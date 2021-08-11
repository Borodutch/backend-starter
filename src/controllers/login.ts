import axios from 'axios'
import { Context, Request } from 'koa'
import { getOrCreateUser } from '@/models/user'
import { Controller, Ctx, Post, Body } from 'amala'
import Facebook = require('facebook-node-sdk')
import { verifyTelegramPayload } from '@/helpers/verifyTelegramPayload'
import { stringify } from 'querystring'
import { isAnyArrayBuffer } from 'util/types'

@Controller('/login')
export default class LoginController {
  @Post('/facebook')
  async facebook(@Body() leadData: { accessToken: string }) {
    const { accessToken } = leadData
    const fbProfile: any = await getFBUser(accessToken)
    const user = await getOrCreateUser({
      name: fbProfile.name,
      email: fbProfile.email,
      facebookId: fbProfile.id,
    })
    return user.strippedAndFilled(true)
  }

  @Post('/telegram')
  async telegram(@Ctx() ctx: Context) {
    const data = ctx.request.body as {
      id: number
      hash: string
      auth_date: string
      first_name: string
      last_name: string
    }
    // verify the data
    if (!verifyTelegramPayload(data)) {
      return ctx.throw(403)
    }

    const user = await getOrCreateUser({
      name: `${data.first_name}${data.last_name ? ` ${data.last_name}` : ''}`,
      telegramId: data.id,
    })
    return user.strippedAndFilled(true)
  }

  @Post('/google')
  async google(@Body() leadData: { accessToken: string }) {
    const { accessToken } = leadData
    const userData: any =
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
  async loginTestUser(@Body() leadData: { name: string; email: string }) {
    const { name, email } = leadData
    const user = await getOrCreateUser({
      name,
      email,
    })
    return user.strippedAndFilled(true)
  }
}

function getFBUser(accessToken: string) {
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
