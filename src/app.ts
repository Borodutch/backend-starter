import 'reflect-metadata'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { bootstrapControllers, Ctx } from 'koa-ts-controllers'
import * as cors from '@koa/cors'
import { runMongo } from '@/models/index'
import * as Router from 'koa-router'
import * as Message from '@/models/message'

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

    // Create a new message
    // Example http://127.0.0.1:1337/message?body=test&createdBy=Nick
    router.post('/message', async ctx => {
      const message = new Message({
        body: ctx.query.body,
        createdBy: ctx.query.createdBy
      })

      await message.save()
        .then((result) => {
          ctx.body = result
        })
        .catch((err) => {
          console.log(err) 
        })
    })

    // Get a message
    // Example http://127.0.0.1:1337/message/60bb41a4d4a24632a81a697b
    router.get('/message/:id', async ctx => {
      await Message.findById(ctx.params.id)
        .then((result) => {
          ctx.body = result
        })
        .catch((err) => {
          console.log(err)
        })
    })

    // Get all messages
    router.get('/messages', async ctx => {
      await Message.find()
        .then((result) => {
          ctx.body = result
        })
        .catch((err) => {
          console.log(err)
        })
    })

    // Update a message
    // Example http://127.0.0.1:1337/message/60bb3e3cb0c4dc2fa17a8b65?body=message
    router.patch('/message/:id', async ctx => {
      const message = await Message.findById(ctx.params.id)
      if (ctx.query.body) {
        message.body = ctx.query.body
      }
      if (ctx.query.createdBy) {
        message.createdBy = ctx.query.createdBy
      }
      
      message.save()
        .then((result) => {
          ctx.body = result
        })
        .catch((err) => {
          console.log(err) 
        })
    })

    // Delete a message
    // Example: http://127.0.0.1:1337/message/60bb568c9ca14e127590375c
    router.delete('/message/:id', async ctx => {
      await Message.findByIdAndDelete(ctx.params.id)
        .then((result) => {
          ctx.body = `You just deleted a message with id ${ctx.params.id}`
        })
        .catch((err) => {
          console.log(err)
        })
    })

  } catch (err) {
    console.log('Koa app starting error: ', err)
  }
})()
