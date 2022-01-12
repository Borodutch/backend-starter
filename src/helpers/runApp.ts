import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import * as logger from 'koa-logger'
import * as render from 'koa-ejs'
import * as serve from 'koa-static'
import { Server } from 'http'
import { UserModel } from '@/models/user'
import { bootstrapControllers, options } from 'amala'
import { resolve } from 'path'

import path = require('path')
import env from '@/helpers/env'
import { property } from 'lodash'
import { mongo } from 'mongoose'

const app = new Koa()

render(app, {
  root: path.join(__dirname, '../views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false,
})
app.use(serve(path.join(__dirname, '../public')))

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
  app.use(logger())
  app.use(router.routes())
  app.use(router.allowedMethods())
  router.get('/', async (ctx) => {
    await ctx.render('index', {
      title: 'Welcome to Chat app',
    })
  })
  router.get('/login', async (ctx) => {
    await ctx.render('login')
  })
  router.get('/signup', async (ctx) => {
    await ctx.render('signup')
  })
  router.post('/login', (ctx) => {
    // handle post request here
    ctx.body = ctx.request.body
    const { name, email, password } = ctx.body
    const user = new UserModel({
      name: name,
      email: email,
      password: password,
    })
    ctx.body = user
    user.save()
  })
  router.post('/signup', (ctx) => {
    // handle post request here
    ctx.body = ctx.request.body
    const { name, email, password } = ctx.body
    const user = new UserModel({
      name: name,
      email: email,
      password: password,
    })
    user.save()
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
