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
      .send({ name: 'testName', email: 'test@email.com' })
    const testToken = responseForLogin.body.token
    const response = await request(server)
      .post('/messages/')
      .send({ text: 'TEST text' })
      .set('token', testToken)
    expect(response.body.text).toBe('TEST text')
    expect(response.body.author.name).toBe('testName')
  })
})
