import * as request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import { dropMongo, startKoa, stopServer } from '@/__tests__/testUtils'
import { runMongo, stopMongo } from '@/helpers/mongo'
import MockAdapter from 'axios-mock-adapter'
import app from '@/app'
import axios from 'axios'
import testingGoogleMock from '@/helpers/testingGoogleMock'

describe('Login endpoint', () => {
  const axiosMock = new MockAdapter(axios)
  let server: Server

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
  })

  beforeEach(async () => {
    await dropMongo()
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('should return user for valid /google request', async () => {
    axiosMock
      .onGet('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=test')
      .reply(200, testingGoogleMock)
    const response = await request(server)
      .post('/login/google')
      .send({ accessToken: 'test' })

    expect(response.body.name).toBe(testingGoogleMock.name)
    expect(response.body.email).toBe(testingGoogleMock.email)
  })
})
