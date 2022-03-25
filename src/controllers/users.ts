import { Context } from 'koa'
import { Controller, Ctx, Get, Params } from 'amala'
import { UserModel } from '@/models/user'
import { notFound } from '@hapi/boom'

@Controller('/users')
export default class UserController {
  @Get('/')
  async findAllUsers(@Ctx() ctx: Context) {
    const users = await UserModel.find()
    if (!users) {
      return ctx.throw(notFound())
    }
    return users
  }

  @Get('/:token')
  async findUserByToken(@Ctx() ctx: Context, @Params('token') token: string) {
    const user = await UserModel.findOne({ token })
    if (!user) {
      return ctx.throw(notFound())
    }
    return user
  }
}
