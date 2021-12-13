import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD for messages', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let token: string
  let id: string

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

  const mockUser = {
    name: 'John Doe',
    email: 'john@doe.com',
  }

  const mockMessage = {
    text: 'Is is a test message',
  }

  const mockUpdatedMessage = {
    text: 'It is an updated message',
  }

  it('Sign in', async () => {
    const response = await request(server).post('/login/email').send(mockUser)
    token = response.body.token
    console.log(response.error)
    expect(response.statusCode).toBe(200)
  })

  it('Post message', async () => {
    const response = await request(server)
      .post('/message')
      .set('Authorization', token)
      .send(mockMessage)
    console.log(response.error)
    id = response.body._id
    expect(response.statusCode).toBe(200)
  })

  it('Get message', async () => {
    const response = await request(server)
      .get(`/message/${id}`)
      .set('Authorization', token)
    console.log(response.error)
    expect(response.statusCode).toBe(200)
  })

  it('Put message', async () => {
    const response = await request(server)
      .put(`/message/${id}`)
      .set('Authorization', token)
      .send(mockUpdatedMessage)
    console.log(response.error)
    expect(response.statusCode).toBe(200)
  })

  it('Delete message', async () => {
    const response = await request(server)
      .put(`/message/${id}`)
      .set('Authorization', token)
    console.log(response.error)
    expect(response.statusCode).toBe(200)
  })
})