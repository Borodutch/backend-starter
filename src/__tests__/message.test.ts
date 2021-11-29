import * as request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import {
  dropMongo,
  setupDotenv,
  startKoa,
  stopServer,
} from '@/__tests__/testUtils'
import { runMongo, stopMongo } from '@/helpers/mongo'
import app from '@/app'

describe('Message endpoint', () => {
  let server: Server
  let token: string
  let id: string

  beforeAll(async () => {
    setupDotenv()
    const mongoServer = await MongoMemoryServer.create()
    await runMongo(mongoServer.getUri())
    server = await startKoa(app)
  })

  afterAll(async () => {
    await dropMongo()
    await stopMongo()
    await stopServer(server)
  })

  it('Create a user. POST @/login/email: returns status code 200', async () => {
    const res = await request(server)
      .post('/login/email')
      .send({ name: 'test', email: 'test@test.test' })

    token = res.body.token
    expect(res.statusCode).toBe(200)
  })

  it('Create a message. POST @/message: returns status code 200', async () => {
    const res = await request(server)
      .post('/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Hello, Test' })

    id = res.body._id
    expect(res.statusCode).toBe(200)
  })

  it('Get a messages. GET @/message: returns status code 200', async () => {
    const res = await request(server)
      .get('/message')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
  })

  it('Get a message. GET @/message/{id}: returns status code 200', async () => {
    const res = await request(server)
      .get(`/message/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
  })

  it('Change a message. PUT @/message/{id}: returns status code 200', async () => {
    const res = await request(server)
      .put(`/message/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'the message has been changed' })

    expect(res.statusCode).toBe(200)
  })

  it('Delete a message. DELETE @/message/{id}: returns status code 204', async () => {
    const res = await request(server)
      .delete(`/message/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(204)
  })
})
