import axios from 'axios'
import { Context } from 'koa'
import { getOrCreateUser } from '@/models/user'
import { Body, Controller, Ctx, Post } from 'amala'

@Controller('/login')
export default class LoginController {
  @Post('/')
  async email(@Body('username') username, @Body('password') password) {
    const user = await getOrCreateUser({
      username,
      password,
    })
    return user
  }

  //   @Post('/')
  //   async google(@Ctx() ctx: Context) {
  //     const accessToken = ctx.request.body.accessToken

  //     const userData: any = (
  //       await axios(
  //         `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`
  //       )
  //     ).data

  //     const user = await getOrCreateUser({
  //       name: userData.name,
  //       email: userData.email,
  //     })
  //     return user
  //   }
}
