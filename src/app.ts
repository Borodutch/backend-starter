import 'reflect-metadata'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { bootstrapControllers } from 'amala'
import * as cors from '@koa/cors'
import * as Router from 'koa-router'
//const crud = require('./controllers/blogRoutes1')
// const crud = require('./controllers/blogController1')
// const router = require("./controllers/blogRoutes1")

export const app = new Koa()
;(async () => {
  try {
    const router = new Router()
    await bootstrapControllers({
      app,
      router,
      basePath: '/',
      controllers: [__dirname + '/controllers/*'],
      disableVersioning: true,
    })
    app.use(cors({ origin: '*' }))
    app.use(bodyParser())
    app.use(router.routes())
    app.use(router.allowedMethods())
    console.log("the precrud")
   // app.use(crud)

    ///app.use(crud)//
  } catch (err) {
    console.log('Koa app starting error: ', err)
  }
})()
