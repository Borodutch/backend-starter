import * as Koa from 'koa'
import Route from '@/helpers/routes'

import * as cors from '@koa/cors'
import { Server } from 'http'
import { bootstrapControllers } from 'amala'
import { resolve } from 'path'
import env from '@/helpers/env'
export const app = new Koa()

export default async function () {
  await bootstrapControllers({
    app,
    basePath: '/',
    controllers: [resolve(__dirname, '../controllers/*')],
    disableVersioning: true,
  })
  app.use(cors({ origin: '*' }))
  Route()
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
