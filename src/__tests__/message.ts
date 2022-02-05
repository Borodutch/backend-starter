import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD messages', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let token: string
  let messageId: string

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  afterAll(async () => {
    await shutdown(server)
    await mongoose.connection.db.dropDatabase()
    await mongoServer.stop()
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  it('Log in', async () => {
    const user = await request(server)
      .post('/login/email')
      .send({ email: 'johngalt@gmail.com', name: 'John' })
    token = user.body.token
    expect(user.statusCode).toBe(200)
  })

  it('Post message', async () => {
    const response = await request(server)
      .post('/message/')
      .set('token', token)
      .send({ text: 'Test text' })
    messageId = response.body._id
    expect(response.statusCode).toBe(200)
  })

  it('Get message', async () => {
    const response = await request(server).get(`/message/`).set('token', token)
    expect(response.statusCode).toBe(200)
  })

  it('Delete message', async () => {
    const response = await request(server)
      .delete(`/message/${messageId}`)
      .set('token', token)
    expect(response.statusCode).toBe(200)
  })
})
