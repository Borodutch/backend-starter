import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

describe('CRUD testing', () => {
  const axiosMock = new MockAdapter(axios)

  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  afterAll(async () => {
    await shutdown(server)
    await mongoServer.stop()
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  describe('GET /message', () => {
    it('should return a 200', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTk5ZThkNmFiYWRlODg5ZjUyYjM3ZCIsImlhdCI6MTY1NTI4MzM0MX0.WPJ7j5GswI_JHQb89B2BBXGBbWio9iU2uxFipqr8bLQ'
      axiosMock.onGet('/message').reply(200, {}, token)

      const response = await request(server)
        .get(`/message`)
        .set('token', `${token}`)

      console.log(response.headers.token)

      expect(response.statusCode).toBe(200)
    })
  })
})
