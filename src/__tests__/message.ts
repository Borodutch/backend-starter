import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { User } from '@/models/User'
import MessageController from '@/controllers/message'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('should perform CRUD operations on the message', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()
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

  const author = {
    email: 'email@google.com',
    name: '1',
  }

  const body = {
    text: 'hi, i`m test text!',
  }

  it('should post message', async () => {
    const response = await request(server)
      .post('/message/')
      .set('Accept', 'application/json')
      .send(body)
      .send(author)
    console.log(response.error)
    console.log(response.body)
    expect(response.body.text).toBe(body.text)
  })
})
