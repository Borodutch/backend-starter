import 'reflect-metadata'
import * as Koa from 'koa'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Ctx, bootstrapControllers } from 'amala'
import router from './routes/todoRoutes'

const app = new Koa()
void (async () => {
  try {
    // const router = new Router()
    await bootstrapControllers({
      app,
      router,
      basePath: '/',
      controllers: [__dirname + '/controllers/*'],
      disableVersioning: true,
    })

    router.redirect('/', '/todos')

    app.use(cors({ origin: '*' }))
    app.use(bodyParser())
    app.use(router.routes())
    app.use(router.allowedMethods())
  } catch (err) {
    console.log('Koa app starting error: ', err)
  }
})()

export default app
