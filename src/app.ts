import 'module-alias/register'
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
import 'reflect-metadata'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { bootstrapControllers } from 'koa-ts-controllers'
import * as cors from '@koa/cors'
import { runMongo } from '@/models/index'
import {  loadControllers } from 'koa-router-ts' 


if (process.env.TESTING !== 'true') {
  runMongo()
}

const app = new Koa()

export async function main() {
 // const router = new Router()
 const router = loadControllers(`${__dirname}/controllers`, { recurse: true })
  await bootstrapControllers(app, {
    router,
    basePath: '/', 
    controllers: [__dirname + '/controllers/*'],
    disableVersioning: true,
  })

    
  
  // Run app
  app.use(cors({ origin: '*' }))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.listen( 3000, 'localhost')
  app.listen( 1337 )
  console.log('Koa application is up and running on port 1337')
}

main()

export default app
