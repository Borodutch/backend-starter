const request = require('supertest')
import { app } from '@/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import { Server } from 'http'
import { startKoa, stopServer } from './testUtils'

describe('crud testing', () => {
  let server: Server
  let token: string
  let messageId: string

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('reg user', async () => {
    const response = await request(server)
      .post('/login/email')
      .send({ name: 'Semion', email: 'babaksemion@gmail.com' })

    expect(response.body.token).toBeTruthy()
    expect(response.status).toBe(200)

    token = response.body.token
  })

  it('Create message', async () => {
    const response = await request(server)
      .post('/message')
      .set('Authorization', 'Bearer ' + token)
      .send({ text: 'New text' })

    expect(response.status).toBe(200)
    expect(response.body.text).toBe('New text')
    messageId = response.body._id
  })

  it('Get message', async () => {
    const response = await request(server)
      .get('/message')
      .set('Authorization', 'Bearer ' + token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body[0].text).toBe('New text')
  })

  it('Put message', async () => {
    const response = await request(server)
      .put('/message/' + messageId)
      .set('Authorization', 'Bearer ' + token)
      .send({ text: 'Very new text 2' })

    expect(response.status).toBe(200)
    expect(response.body.text).toBe('Very new text 2')
  })

  it('Del message', async () => {
    const response = await request(server)
      .delete('/message/' + messageId)
      .set('Authorization', 'Bearer ' + token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(messageId)
  })
})
