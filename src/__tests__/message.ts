const request = require('supertest')
import { app } from '@/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import { Server } from 'http'
import { dropMongo, startKoa, stopServer } from './testUtils'
import { MessageModel } from '@/models/message'

describe('Message endpoint', () => {
  let server: Server
  let user: unknown
  let token: unknown

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
  })

  beforeEach(async () => {
    await dropMongo()
    const gotUser = await request(server)
      .post('/login/email')
      .set('Accept', 'application/json')
      .send({ email: 'test@test.com', name: 'Max' })
    token = gotUser.body.token
    user = gotUser.body

    await MessageModel.create({
      _id: '6118ebccdcbcfdadd13c420e',
      text: 'text for test',
      user,
    })
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('should create message for valid /message POST request', async () => {
    const response = await request(server)
      .post('/message')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({ text: 'Some text', user })
    expect(response.body.text).toBe('Some text')
  })

  it('should return message for valid /message/:id GET request', async () => {
    const response = await request(server)
      .get('/message/6118ebccdcbcfdadd13c420e')
      .set('Accept', 'application/json')
      .set('Authorization', token)
    expect(response.body.text).toBe('text for test')
  })

  it('should update message for valid /message/:id PUT request', async () => {
    const response = await request(server)
      .put('/message/6118ebccdcbcfdadd13c420e')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({
        text: 'Updated text for test',
      })
    expect(response.body.text).toBe('Updated text for test')
  })

  it('should delete message for valid /message/:id DELETE request', async () => {
    const response = await request(server)
      .delete('/message/6118ebccdcbcfdadd13c420e')
      .set('Accept', 'application/json')
      .set('Authorization', token)
    expect(response.body.text).toBe('text for test')
    expect(response.body._id).toBe('6118ebccdcbcfdadd13c420e')
  })
})
