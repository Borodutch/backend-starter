import 'module-alias/register'
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
import 'reflect-metadata'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import { bootstrapControllers } from 'koa-ts-controllers'
import * as cors from '@koa/cors'
import runMongo from '@/models/index'

require('module-alias/register')

const app = new Koa()

if (process.env.TESTING !== 'true') {
  runMongo()
}

export async function main() {
  const router = new Router()

  await bootstrapControllers(app, {
    router,
    basePath: '/',
    controllers: [__dirname + '/controllers/*'], // It is recommended to add controllers classes directly to this array, but you can also add glob strings
    disableVersioning: true,
  })

  // Run app
  app.use(cors({ origin: '*' }))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.listen(1337)
  console.log('Koa application is up and running on port 1337')
}

main()

export default app
