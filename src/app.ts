import 'module-alias/register'
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
import 'reflect-metadata'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { bootstrapControllers } from 'koa-ts-controllers'
import * as cors from '@koa/cors'
import { runMongo } from '@/models/index'
import * as Router from 'koa-router'
import { readDB, saveToDB, readIdDB, readOneDB, updatedDB, deleteDB } from './models/cont'


if (process.env.TESTING !== 'true') {
  runMongo()
}

const app = new Koa()

export async function main() {
  const router = new Router()

  await bootstrapControllers(app, {
    router,
    basePath: '/',
    controllers: [__dirname + '/controllers/*'],
    disableVersioning: true,
  })
  
//CRUD
 
router.get('/save', async (ctx, next)=>{
   
  let msg=ctx.request.body
  
 
    saveToDB(msg)
 
  next()
  console.log(msg)
} )
router.get('/read', async (ctx, next)=>{
   
  let msg=ctx.request.body

  readDB(msg)
   
  await next()
} )
router.get('/read-one', async (ctx, next)=>{
 
  let msg=ctx.request.body

  readOneDB(msg)
  
   await next()
 
} )
router.get('/read-id', async (ctx, next)=>{
   
  let msg=ctx.request.body

  readIdDB(msg)

  await next()
  } )
router.put('/update', async (ctx, next) =>{
 
  let msg=ctx.request.body

  updatedDB(msg)

  await next
} 
)
router.delete('/delete', async (ctx, next) =>{
   
  let msg=ctx.request.body

  deleteDB(msg)

  await next
}
)
//
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
