import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'

import { MessageModel } from '@/models/Message'
import { Server } from 'http'
import { bootstrapControllers } from 'amala'
import { findOrCreateUser } from '@/models/user'
import { resolve } from 'path'
import { verify } from '@/helpers/jwt'
import env from '@/helpers/env'

const app = new Koa()

export default async function () {
  const router = new Router()
  await bootstrapControllers({
    app,
    router,
    basePath: '/',
    controllers: [resolve(__dirname, '../controllers/*')],
    disableVersioning: true,
  })
  app.use(cors({ origin: '*' }))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
  router.get('/login', (ctx) => {
    ctx.body = 'please signup or login'
  })
  router.post('/login', async (ctx) => {
    // const { name, email } = ctx.request.body
    await findOrCreateUser(ctx.request.body).then((result) => {
      ctx.cookies.set('token', result.token, { maxAge: 60 * 1000 * 60 })
      //если получилось ли не получилось авторизоваться, хотя при нынешнем способе авторизация происходит в любом сучае
      result.token
        ? ctx.redirect('/message')
        : (ctx.body = 'please try to login or signup again')
    })
  })
  router.get('/message', (ctx) => {
    const token = ctx.cookies.get('token')
    token ? verify(token) : ctx.redirect('/login')
    ctx.body = 'ok, you can chatting'
  })
  router.post('/message', async (ctx) => {
    await MessageModel.create(ctx.request.body)
  })
  return new Promise<Server>((resolve, reject) => {
    const connection = app
      .listen(env.PORT)
      .on('listening', () => {
        console.log(`HTTP is listening on ${env.PORT}`)
        resolve(connection)
      })
      .on('error', reject)
  })
}
