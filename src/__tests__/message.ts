const request = require('supertest')
import { app } from '@/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import { Server } from 'http'
import { completeUser, dropMongo, startKoa, stopServer } from './testUtils'
import { UserModel } from '@/models/user'
import { MessageModel } from '@/models/message'

describe('Test message CRUD', () => {
  const testUserToken = completeUser.token

  let testMessageId: String
  let server: Server

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
  })

  beforeEach(async () => {
    await dropMongo()
    const testUser = await UserModel.create(completeUser)

    const testMessage = await MessageModel.create({
      text: 'New message',
      user: testUser,
    })

    testMessageId = testMessage._id.toString()
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('Test GET /message/', async () => {
    const response = await request(server)
      .get('/message/')
      .set('accessToken', testUserToken)
      .send()

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('Test GET /message/:id', async () => {
    const response = await request(server)
      .get('/message/' + testMessageId)
      .set('accessToken', testUserToken)
      .send()

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(testMessageId)
    expect(response.body.text).toBe('New message')
  })

  it('Test GET /message/:id wrong id', async () => {
    const response = await request(server)
      .get('/message/123')
      .set('accessToken', testUserToken)

    expect(response.status).toBe(500)
  })

  it('Test POST /message/', async () => {
    const response = await request(server)
      .post('/message/')
      .set('accessToken', testUserToken)
      .send({
        text: 'Test message',
      })

    expect(response.status).toBe(200)
    expect(response.body.text).toBe('Test message')
  })

  it('Test POST /message/ without text', async () => {
    const response = await request(server)
      .post('/message/')
      .set('accessToken', testUserToken)
      .send()

    expect(response.status).toBe(500)
  })

  it('Test PUT /message/:id', async () => {
    const response = await request(server)
      .put('/message/' + testMessageId)
      .set('accessToken', testUserToken)
      .send({ text: 'Change message' })

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(testMessageId)
  })

  it('Test PUT /message/:id wrong id', async () => {
    const response = await request(server)
      .put('/message/123')
      .set('accessToken', testUserToken)
      .send({ text: 'new text' })

    expect(response.status).toBe(500)
  })

  it('Test DELETE /message/:id', async () => {
    const response = await request(server)
      .delete('/message/' + testMessageId)
      .set('accessToken', testUserToken)
      .send()

    expect(response.status).toBe(204)
  })

  it('Test DELETE /message/:id wrong id', async () => {
    const response = await request(server)
      .delete('/message/123')
      .set('accessToken', testUserToken)
      .send()

    expect(response.status).toBe(500)
  })
})
