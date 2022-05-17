import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD endpoint', () => {
  const axiosMock = new MockAdapter(axios)

  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  const emailAccountMock = {
    name: 'Name',
    email: 'name@gmail.com',
    token: '',
    id: '',
  }

  const messageMock = {
    text: 'Bebra',
    id: '',
  }

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

  it('should return user for /login/email request', async () => {
    const response = await request(server)
      .post('/login/email')
      .send({name: emailAccountMock.name, email: emailAccountMock.email})
    emailAccountMock.token = response.body.token
    emailAccountMock.id = response.body._id
    expect(response.body.name).toBe(emailAccountMock.name)
    expect(response.body.email).toBe(emailAccountMock.email)
  })

  it('should return posted message for /messages request', async () => {
    const response = await request(server)
      .post('/messages')
      .set('token', emailAccountMock.token)
      .send({text: messageMock.text})
    messageMock.id = response.body._id
    expect(response.body.text).toBe(messageMock.text)
  })
})
