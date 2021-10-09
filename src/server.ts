// Setup typegoose
import { setGlobalOptions, Severity } from '@typegoose/typegoose'
setGlobalOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
import 'module-alias/register'
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
import { app } from '@/app'
import { runMongo } from '@/models/index'

// Run mongo
runMongo().then(() => {
  console.log('Mongo connected')
})
// Start rest
app.listen(1337).on('listening', () => {
  console.log('HTTP is listening on 1337')
})

// app.use(async (ctx, next) => {
// await next()
// const rt = ctx.response.get('X-Response-Time')
// console.log(`${ctx.method} ${ctx.url} - ${rt}`)
// })
//
// x-response-time
//
// app.use(async (ctx, next) => {
// const start = Date.now()
// await next()
// const ms = Date.now() - start
// ctx.set('X-Response-Time', `${ms}ms`)
// })
//
// response
//
// app.use(async (ctx) => {
// ctx.body = 'Hello World'
// })
//
