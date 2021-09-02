import * as mongoose from 'mongoose'
import * as Koa from 'koa'
import { Server } from 'http'

export function dropMongo() {
  return Promise.all(
    Object.values(mongoose.connection.collections).map((collection) =>
      collection.deleteMany({})
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

export const completeUser = {
  username: 'Alexander Brennenburg',
  password: 'alexanderrennenburg@gmail.com',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWxleGFuZGVyIEJyZW5uZW5idXJnIiwic3Vic2NyaXB0aW9uU3RhdHVzIjoidHJpYWwiLCJkZWxlZ2F0ZUludml0ZVRva2VuIjoiR090WWwyRUVaSE1OMmF1cSIsImVtYWlsIjoiYWxleGFuZGVycmVubmVuYnVyZ0BnbWFpbC5jb20iLCJpYXQiOjE2MDUxMjY5MTF9.Z17DwU2HuIcqBgvrzl65X47q3iRMuvybbYLmz9yc5ns',
 
}
