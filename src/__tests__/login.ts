import * as request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import { UserModel } from '@/models/user'
import { app } from '@/app'
import { completeUser, dropMongo, startKoa, stopServer } from './testUtils'
import { runMongo, stopMongo } from '@/models/index'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

describe('Login endpoint', () => {
  const axiosMock = new MockAdapter(axios)

  let server: Server

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
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
    await UserModel.create(completeUser)
    axiosMock
      .onGet('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=test')
      .reply(200, {
        name: 'Alexander Brennenburg',
        email: 'alexanderrennenburg@gmail.com',
      })
    const response = await request(server)
      .post('/login/google')
      .send({ accessToken: 'test' })

    expect(response.body.name).toBe('Alexander Brennenburg')
    expect(response.body.email).toBe('alexanderrennenburg@gmail.com')
  })
})
