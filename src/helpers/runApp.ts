import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import { Server } from 'http'
import { bootstrapControllers } from 'amala'
import { resolve } from 'path'
import env from '@/helpers/env'
import mongoose from 'mongoose'

require('./CRUDmodel')

const Message_model = mongoose.model('message collection')

// 1 - Create, 2 - Read, 3 - Update, 4 - Delete
var w = 1

switch (w) {
  case 1:
    // 01 Create
    const message_m = new Message_model({ text_field: 'pretty good text' })
    message_m
      .save()
      .then((m: any) => console.log(m))
      .catch((e: any) => console.log(e))
    break
  case 2:
    // 02 Read
    Message_model.find({}).then((m: any) => {
      console.log(m)
    })
    break
  case 3:
    // 03 Update
    Message_model.updateMany(
      { text_field: 'pretty good text' },
      { text_field: 'pretty good text2' }
    )
      .then(() => {
        console.log('updated')
      })
      .catch((e: any) => console.log(e))
    break
  case 4:
    // 04 Delete
    Message_model.find({ text_field: 'pretty good text2' })
      .deleteMany()
      .then(() => {
        console.log('deleted')
      })
      .catch((e: any) => console.log(e))
    break
  default:
}

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
