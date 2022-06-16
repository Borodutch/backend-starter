import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import * as ejs from 'koa-ejs'
import * as path from 'path'
import * as staticFiles from 'koa-static'
import * as views from 'koa-views'
import { Server } from 'http'
import { bootstrapControllers } from 'amala'
import {
  message_delete,
  message_get,
  message_post,
  message_put,
} from '@/controllers/messageController'
import { resolve } from 'path'
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
  ejs(app, {
    root: path.resolve(__dirname, 'views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false,
  })
  router.get('/', message_get)
  router.post('/', message_post)
  router.delete('/:id', message_delete)
  router.put('/:id', message_put)
  app.use(staticFiles('./public'))
  app.use(views('./views', { map: { html: ejs } }))
  app.use(cors({ origin: '*' }))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
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
