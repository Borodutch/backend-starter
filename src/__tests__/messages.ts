const request = require('supertest')
import { app } from '@/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import { Server } from 'http'
import { messageModel } from '@/models/message'
import { dropMongo, startKoa, stopServer } from './testUtils'
import { getOrCreateUser, User } from '@/models/user'

describe('Test endpoints', () => {
  let server: Server
  let user: User
  let ms: any

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)

    user = await getOrCreateUser({
      name: 'jest',
      email: 'jest@live.com',
    })
    user.strippedAndFilled(true)

    const res = await request(server)
      .post('/messages/')
      .send({ message: 'test0' })
      .set('token', user.token)
      .expect(200)
    ms = res.body
  })

  afterAll(async () => {
    await dropMongo()
    await stopMongo()
    await stopServer(server)
  })

  it('POST /messages/, should add new message', async () => {
    const res = await request(server)
      .post('/messages/')
      .send({ message: 'test1' })
      .set('token', user.token)
      .expect(200)

    const message = await messageModel.findOne({ _id: res.body._id })
    expect(message.message).toEqual('test1')
  })

  it('GET /messages/, should get messages', async () => {
    const res = await request(server)
      .get('/messages/')
      .set('token', user.token)
      .expect(200)

    expect(res.body.length).toEqual(2)
    expect(res.body[0].message).toEqual('test0')
    expect(res.body[1].message).toEqual('test1')
    expect(res.body[0].user.name && res.body[0].user.name).toEqual('jest')
  })

  it('GET /messages/:id, should get one message', async () => {
    const res = await request(server)
      .get('/messages/' + ms._id)
      .set('token', user.token)
      .expect(200)

    expect(res.body.message).toEqual('test0')
    expect(res.body.user.name && res.body.user.name).toEqual('jest')
  })

  it('PUT /messages/:id, should change message', async () => {
    const res = await request(server)
      .put('/messages/' + ms._id)
      .send({ message: 'test1' })
      .set('token', user.token)
      .send({ message: 'change0' })
      .expect(200)

    const message = await messageModel.findOne({ _id: res.body._id })
    expect(message.message).toEqual('change0')
  })

  it('DELETE /messages/:id, should delete message', async () => {
    await request(server)
      .get('/messages/' + ms._id)
      .set('token', user.token)
      .expect(200)

    const message = await messageModel.findOne({ _id: ms._id })
    expect(message).toBeUndefined
  })
})
