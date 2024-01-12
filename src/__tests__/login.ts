import MockAdapter from 'axios-mock-adapter'
import request from 'supertest'
import shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import axios from 'axios'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Login endpoint', () => {
  const axiosMock = new MockAdapter(axios)

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

  it('should return user for valid /google request', async () => {
    const testingGoogleMock = {
      email: 'john@doe.com',
      name: 'John Doe',
    }
    axiosMock
      .onGet('https://www.googleapis.com/oauth2/v3/userinfo?access_token=test')
      .reply(200, testingGoogleMock)
    const response = await request(server)
      .post('/login/google')
      .send({ accessToken: 'test' })
    expect(response.body.name).toBe(testingGoogleMock.name)
    expect(response.body.email).toBe(testingGoogleMock.email)
  })
})
