import axios from 'axios'
import { Context } from 'koa'
import { getOrCreateUser } from '../models'
import { getAllMessages, deleteMessage, updateMessage, createMessage } from '../models/message'
import { Controller, Post, Get, Delete, Put } from 'koa-router-ts'
import Facebook = require('facebook-node-sdk')
const TelegramLogin = require('node-telegram-login')
const Login = new TelegramLogin(process.env.TELEGRAM_LOGIN_TOKEN)

const Message = require('../models/message');

@Controller('')
export default class {
  @Post('/facebook')
  async facebook(ctx: Context) {
    const fbProfile: any = await getFBUser(ctx.request.body.accessToken)
    const user = await getOrCreateUser({
      name: fbProfile.name,

      email: fbProfile.email,
      facebookId: fbProfile.id,
    })
    ctx.body = user.strippedAndFilled(true)
  }

  @Post('/addMsg')
  async createMessage(ctx: Context) {
    const msg: any = ctx.request.body;
    const user = await createMessage({
      title: msg.title,
      text: msg.text
    })
    ctx.body = user
  }

  @Put('/updateMsg')
  async updateMessage(ctx: Context) {
    const msg: any = ctx.request.body;
    const user = await updateMessage({
      text: msg.text,
      id: msg.id,
    })
    ctx.body = user
  }

  @Delete('/deleteMsg')
  async deleteMessage(ctx: Context) {
    const id: any = ctx.request.body.id;
    const user = await deleteMessage(id)
    ctx.body = user
  }

  @Get('/')
  async getMessages(ctx: Context) {
    const user = await getAllMessages()
    ctx.body = user
  }

  @Post('/telegram')
  async telegram(ctx: Context) {
    const data = ctx.request.body
    // verify the data
    if (!Login.checkLoginData(data)) {
      return ctx.throw(403)
    }

    const user = await getOrCreateUser({
      name: `${data.first_name}${data.last_name ? ` ${data.last_name}` : ''}`,
      telegramId: data.id,
    })
    ctx.body = user.strippedAndFilled(true)
  }

  @Post('/google')
  async google(ctx: Context) {
    const accessToken = ctx.request.body.accessToken

    const userData: any = (
      await axios(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`
      )
    ).data

    const user = await getOrCreateUser({
      name: userData.name,

      email: userData.email,
    })
    ctx.body = user.strippedAndFilled(true)
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
