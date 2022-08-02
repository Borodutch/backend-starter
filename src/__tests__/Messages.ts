import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD endpoint', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  const testUser = {
    name: 'testName',
    email: 'test@email.com',
  }
  const testMessage = {
    text: 'Some text for test message',
  }
  const testMessageUpd = {
    text: 'UPDATED text for test message',
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

  it('POST request should return message', async () => {
    const responseForLogin = await request(server)
      .post('/login/email')
      .send(testUser)
    const testToken = responseForLogin.body.token
    const response = await request(server)
      .post('/messages/')
      .send(testMessage)
      .set('token', testToken)
    expect(response.body.text).toBe(testMessage.text)
    expect(response.body.author.name).toBe(testUser.name)
    expect(response.body.author.email).toBe(testUser.email)
  })

  it('PUT request should update message', async () => {
    const responseForLogin = await request(server)
      .post('/login/email')
      .send(testUser)
    const testToken = responseForLogin.body.token
    const response = await request(server)
      .post('/messages/')
      .send(testMessage)
      .set('token', testToken)
    const idForPut = response.body._id
    const responseForPut = await request(server)
      .put(`/messages/${idForPut}`)
      .send(testMessageUpd)
      .set('token', testToken)
    expect(responseForPut.body.text).toBe(testMessageUpd.text)
  })
})
