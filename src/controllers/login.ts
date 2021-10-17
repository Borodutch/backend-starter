import axios from 'axios'
import { Context } from 'koa'
import { getOrCreateUser } from '@/models/user'
import { Body, Controller, Ctx, Post } from 'amala'
import Facebook = require('facebook-node-sdk')
import {
  TelegramLoginPayload,
  verifyTelegramPayload,
} from '@/helpers/verifyTelegramPayload'

@Controller('/login')
export default class LoginController {
  @Post('/facebook')
  async facebook(@Body('accessToken') accessToken: string) {
    const fbProfile: any = await getFBUser(accessToken)
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
      return ctx.throw(403)
    }

    const user = await getOrCreateUser({
      name: `${data.first_name}${data.last_name ? ` ${data.last_name}` : ''}`,
      telegramId: data.id,
    })
    return user.strippedAndFilled(true)
  }

  @Post('/google')
  async google(@Body('accessToken') accessToken: string) {
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
//CRUD blogcontroller

const Blog = require('../models/blog');
console.log("BLOG model created...")
const blog_index = (req, res) => {
  console.log("blog_index function")
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_create_get = (req, res) => {
  res.render('create', { title: 'Create a new blog' });
}

const blog_create_post = (req, res) => {
  const blog = new Blog(req.body);
  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  blog_index, 
  blog_details, 
  blog_create_get, 
  blog_create_post, 
  blog_delete
}