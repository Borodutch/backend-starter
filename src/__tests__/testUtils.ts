import * as Koa from 'koa'
import * as dotenv from 'dotenv'
import * as mongoose from 'mongoose'
import { Server } from 'http'

export function setupDotenv() {
  dotenv.config({ path: `${__dirname}/../../.env` })
}

export function dropMongo() {
  return Promise.all(
    Object.values(mongoose.connection.collections).map(
      (collection: mongoose.Collection) => collection.deleteMany({})
    )
  )
}

export function startKoa(
  app: Koa<Koa.DefaultState, Koa.DefaultContext>
): Promise<Server> {
  return new Promise((res, rej) => {
    const connection = app
      .listen()
      .on('listening', () => {
        res(connection)
      })
      .on('error', rej)
  })
}

export function stopServer(server: Server) {
  return new Promise<void>((res) => {
    server.close(() => {
      res()
    })
  })
}
