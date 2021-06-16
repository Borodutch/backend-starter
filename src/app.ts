<<<<<<< HEAD
import "reflect-metadata"
import * as Koa from "koa"
import * as bodyParser from "koa-bodyparser"
import { bootstrapControllers } from "amala"
import * as cors from "@koa/cors"
import * as Router from "koa-router"
=======
import 'reflect-metadata'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { bootstrapControllers } from 'amala'
import * as cors from '@koa/cors'
import * as Router from 'koa-router'
>>>>>>> 57d0976e211ff2fe7bb91bf288fe640a1e84d10d

export const app = new Koa()
;(async () => {
  try {
    const router = new Router()
    await bootstrapControllers({
      app,
      router,
      basePath: "/",
      controllers: [__dirname + "/controllers/*"],
      disableVersioning: true,
    })
<<<<<<< HEAD
    app.use(cors({ origin: "*" }))
=======
    app.use(cors({ origin: '*' }))
>>>>>>> 57d0976e211ff2fe7bb91bf288fe640a1e84d10d
    app.use(bodyParser())
    app.use(router.routes())
    app.use(router.allowedMethods())
  } catch (err) {
    console.log("Koa app starting error: ", err)
  }
})()
