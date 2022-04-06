import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD endpoints', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  const userMock = {
    name: 'Pepe',
    email: 'pepe@gmail.com',
    token: '',
    id: '',
  }
  const messageMock = {
    text: 'Text',
    id: '',
  }

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

  it('should return user for /email request', async () => {
    const response = await request(server).post('/login/email').send(userMock)
    userMock.token = response.body.token
    userMock.id = response.body._id
    expect(response.body.name).toBe(userMock.name)
    expect(response.body.email).toBe(userMock.email)
  })

  it('should return message for /post request', async () => {
    const response = await request(server)
      .post('/messages/')
      .set('token', userMock.token)
      .send({ text: 'Text' })
    messageMock.id = response.body._id
    expect(response.body.author._id).toBe(userMock.id)
    expect(response.body.text).toBe(messageMock.text)
  })

  it('should return message for /get request', async () => {
    const response = await request(server)
      .get(`/messages/`)
      .set('token', userMock.token)
    expect(response.body[0]._id).toBe(messageMock.id)
    expect(response.body[0].author).toBe(userMock.id)
  })

  it('should return updated message for /patch request', async () => {
    const response = await request(server)
      .patch(`/messages/${messageMock.id}`)
      .set('token', userMock.token)
      .send({ text: 'txeT' })
    expect(response.body._id).toBe(messageMock.id)
    expect(response.body.author).toBe(userMock.id)
    expect(response.body.text).not.toBe(messageMock.text)
  })

  it('should remove message for /delete request', async () => {
    const response = await request(server)
      .delete(`/messages/${messageMock.id}`)
      .set('token', userMock.token)
    expect(response.statusCode).toBe(200)
  })
})
