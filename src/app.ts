import 'reflect-metadata'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { bootstrapControllers } from 'koa-ts-controllers'
import * as cors from '@koa/cors'
import { runMongo } from '@/models/index'
import * as Router from 'koa-router'
import * as render from 'koa-ejs'
import * as serve from 'koa-static'
import * as path from 'path'
import {getIndex, getAdd, add, deleteMessage, updateMessage} from './controllers/crudController.js'
import { facebookLogin, telegramLogin, checkUser, logout} from './controllers/authController.js'

export const app = new Koa()
;(async () => {
  try {
    const router = new Router()
    await bootstrapControllers(app, {
      router,
      basePath: '/',
      controllers: [__dirname + '/controllers/*'],
      disableVersioning: true,
    })
    
    app.use(cors({ origin: '*' }))
    app.use(cors({ origin: '*' }))  
    app.use(bodyParser())
    app.use(router.routes())
    app.use(router.allowedMethods())
    app.use(serve('./public'))
    
    render(app, {
      root: path.join(__dirname, '..', 'public'),
      layout: 'layout',
      viewExt: 'html',
      cache: false,
      debug: false,
  })
    router.use(checkUser)
    router.get('/', getIndex)
    router.get('/add', getAdd)
    router.post('/add', add)
    router.delete('/', deleteMessage)
    router.put('/', updateMessage)
    router.post('/facebooklogin', facebookLogin)
    router.post('/telegramlogin', telegramLogin)
    router.get('/logout', logout)
  
  } catch (err) {
    console.log('Koa app starting error: ', err)
  }
})()

