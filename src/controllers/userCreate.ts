import { Context } from 'koa'
import { getOrCreateUser } from '../models/user'
import { Controller, Post } from 'koa-router-ts'


@Controller('/user')
export default class {

  @Post('/createUser')
  async createUser(ctx: Context) {
    const newUser = ctx.request.body;
    
    const user = await getOrCreateUser({
      name: newUser.name,
      email: newUser.mail
    })
    console.log(user)
    ctx.body = user
  }
}
