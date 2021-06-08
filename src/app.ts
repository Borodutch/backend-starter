import 'reflect-metadata'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { bootstrapControllers, Ctx, getControllers } from 'koa-ts-controllers'
import * as cors from '@koa/cors'
import { runMongo } from '@/models/index'
import * as Router from 'koa-router'
import MessageController from '@/controllers/message'

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

 
    const messageHandler = new MessageController();
    // Create a new message
    // Example http://127.0.0.1:1337/message?body=test&createdBy=Nick
    router.post('/message', messageHandler.create)

    // Get a message
    // Example http://127.0.0.1:1337/message/60bb41a4d4a24632a81a697b
    router.get('/message/:id', messageHandler.getOne)

    // Get all messages
    router.get('/messages', messageHandler.getAll)

    // Update a message
    // Example http://127.0.0.1:1337/message/60bb3e3cb0c4dc2fa17a8b65?body=message
    router.patch('/message/:id', messageHandler.update)

    // Delete a message
    // Example: http://127.0.0.1:1337/message/60bb568c9ca14e127590375c
    router.delete('/message/:id', messageHandler.delete)

  } catch (err) {
    console.log('Koa app starting error: ', err)
  }
})()
