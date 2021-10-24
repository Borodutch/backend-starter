const request = require('supertest')
import { app } from '@/app'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { Server } from 'http'
import { startKoa, stopServer } from './testUtils'
import { UserModel } from '@/models/user'

describe('Test messages endpoints', () => {
  const axiosMock = new MockAdapter(axios)

  let server: Server
  let msgId: string
  let token = process.env.TOKEN

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('Post messages', async () => {
    const res = await request(server)
      .post('/messages/')
      .set(token, 'token')
      .send({ message: 'test1' })
      .expect(200)
    msgId = res.body._id
  })
})