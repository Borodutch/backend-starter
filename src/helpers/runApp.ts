import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import { Server } from 'http'
import { bootstrapControllers } from 'amala'
import { resolve } from 'path'
import env from '@/helpers/env'

const app = new Koa()

export default async function () {
  const router = new Router()
  const Message = require('../models/messagemodel')

// get a list of messages 
  router.get('/messages', async function(ctx, next){
    ctx.body = await Message.find({})
    next()
  })

// add new message
  router.post('/messages', async function(ctx, next){
    await Message.create(ctx.request.body)
    next()
  })

// update a message (edit)
  router.put('/messages/:id', async function(ctx, next){
    await Message.findByIdAndUpdate({_id: ctx.params.id}, {message_body: "edited: " + ctx.request.body.message_body})
    next()
  })

// delete a message from the db
  router.delete('/messages/:id', async function(ctx, next){
    await Message.findByIdAndRemove({_id: ctx.params.id})
    next()
  })

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
