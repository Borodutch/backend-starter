import * as dotenv from 'dotenv'
import * as request from 'supertest'
import { app } from '@/app'
dotenv.config({ path: '.env' })
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import { runMongo, stopMongo } from '@/models/index'
import { setupDotenv, startKoa, stopServer } from './testUtils'

describe('Test messages endpoints', () => {
  let server: Server
  let msgId: string
  let token: string

  beforeAll(async () => {
    setupDotenv()
    const mongoServer = await MongoMemoryServer.create()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('reg user', async () => {
    const res = await request(server)
      .post('/login/email')
      .send({ email: 'Shiba@elonmusk', name: 'EA-18' })
      .expect(200)

    expect(res.body.token).toBeTruthy()
    token = res.body.token
  })

  it('Post messages', async () => {
    const res = await request(server)
      .post('/messages/')
      .set('token', token)
      .send({ text: 'test1' })
      .expect(200)
    msgId = res.body._id
  })

  it('Get messages', async () => {
    const res = await request(server)
      .get(`/messages/${msgId}`)
      .set('token', token)
      .send()
    expect(res.body.text).toBe('test1')
  })

  it('Put messages', async () => {
    const res = await request(server)
      .put(`/messages/${msgId}`)
      .set('token', token)
      .send({ text: 'message has been updated' })
    expect(res.body.text).toBe('message has been updated')
  })

  it('Delete messages', async () => {
    const res = await request(server)
      .delete(`/messsages/${msgId}`)
      .set('token', token)
      .send()
    expect(res.body.text).toBeFalsy
  })
})
