import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { User } from '@/models/user'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD for messages', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let user: User
  let token: string
  let messageId: string

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()

    const mockUser = await request(server)
      .post('/login/email')
      .send({ email: 'john@doe.com', name: 'John Doe' })
    user = mockUser.body
    token = mockUser.body.token
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

  it('Post message', async () => {
    const response = await request(server)
      .post('/message/')
      .set('Authorization', token)
      .send({ text: 'Test text' })
    messageId = response.body._id
    expect(response.statusCode).toBe(200)
  })

  it('Get message', async () => {
    const response = await request(server)
      .get(`/message/${messageId}`)
      .set('Authorization', token)
    expect(response.statusCode).toBe(200)
  })

  it('Put message', async () => {
    const response = await request(server)
      .put(`/message/${messageId}`)
      .set('Authorization', token)
      .send({ text: 'It is an updated text', user })
    expect(response.statusCode).toBe(200)
  })

  it('Delete message', async () => {
    const response = await request(server)
      .delete(`/message/${messageId}`)
      .set('Authorization', token)
    expect(response.statusCode).toBe(200)
  })
})
