import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Send message', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let token: null
  let idText: null
  let idAuthor: null

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase()
    await shutdown(server)
    await mongoServer.stop()
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  it('should return user token /login/email', async () => {
    const testEmailMock = { email: 'test@mail.test', name: 'test' }

    const response = await request(server)
      .post('/login/email')
      .send(testEmailMock)
    console.log(response.error)
    token = response.body.token
    idAuthor = response.body._id
  })

  it('should return sent message /message/', async () => {
    const response = await request(server)
      .post('/message/')
      .set({ token: token })
      .send({ text: 'test' })
    console.log(response.error)
    expect(response.body.text).toBe('test')
    idText = response.body._id
  })

  it('should edit message /message/:id', async () => {
    const response = await request(server)
      .put(`/message/${idText}`)
      .set({ token: token })
      .send({ text: 'edited message' })
    console.log(response.error)
    expect(response.body.text).toBe('test')
    expect(response.body.author).toBe(idAuthor)
  })

  it('should return all messages /message/', async () => {
    const response = await request(server)
      .get('/message/')
      .set({ token: token })
    console.log(response.error)
    expect(response.body).toBeTruthy()
  })

  it('should delete message /message/:id', async () => {
    const response = await request(server)
      .del(`/message/${idText}`)
      .set({ token: token })
    console.log(response.error)
    expect(response.body._id).toBe(idText)
    expect(response.body.author).toBe(idAuthor)
  })
})
