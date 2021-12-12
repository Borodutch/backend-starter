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
  })

  it('Sign in', async () => {
    const response = await request(server)
      .post('/login/email')
      .send({ name: 'Test User', email: 'testing@google.com' })
    token = response.body.token
    console.log(response.error)
    expect(response.statusCode).toBe(200)
  })

  it('Post message', async () => {
    const response = await request(server)
      .post('/message')
      .set({ authorization: token })
      .send({ user: 'Test User', text: 'Test text' })
    console.log(response.error)
    id = response.body._id
    expect(response.statusCode).toBe(200)
  })

  it('Get message', async () => {
    const response = await request(server)
      .get(`/message/${id}`)
      .set({ authorization: token })
      .send()
    console.log(response.error)
    expect(response.statusCode).toBe(200)
  })

  it('Put message', async () => {
    const response = await request(server)
      .put(`/message/${id}`)
      .set({ authorization: token })
      .send({ text: 'Updated test text' })
    console.log(response.error)
    expect(response.statusCode).toBe(200)
  })

  it('Delete message', async () => {
    const response = await request(server)
      .put(`/message/${id}`)
      .set({ authorization: token })
      .send()
    console.log(response.error)
    expect(response.statusCode).toBe(200)
  })
})
