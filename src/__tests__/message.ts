const request = require('supertest')
import { app } from '@/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import { Server } from 'http'
import { dropMongo, startKoa, stopServer } from './testUtils'
import { getOrCreateUser, User } from '@/models/user'
import { MessageModel } from '@/models/message'

describe('CRUD endpoint test', () => {
  let user: User
  let server: Server

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
    user = await getOrCreateUser({ name: 'test', email: 'test@mail.ru' })
  })

  afterAll(async () => {
    await dropMongo()
    await stopMongo()
    await stopServer(server)
  })

  it('(Create) POST /messages/create', async () => {
    await request(server)
      .post('/messages/create')
      .send({ text: 'hi' })
      .set('authorization', user.token)
      .expect(200)

    const message = await MessageModel.findOne({ author: user.name })

    expect(message.text).toEqual('hi')
    expect(message.author).toEqual('test')
  })

  it('(Read) GET /messages', async () => {
    await request(server)
      .post('/messages/create')
      .send({ text: 'bye' })
      .set('authorization', user.token)
      .expect(200)

    const response = await request(server)
      .get('/messages')
      .set('authorization', user.token)
      .expect(200)

    expect(response.body.length).toEqual(2)
    expect(response.body[0].text).toEqual('hi')
    expect(response.body[1].text).toEqual('bye')
    expect(response.body[0].author && response.body[1].author).toEqual('test')
  })

  it('(Read) GET /messages/:id', async () => {
    const message = await MessageModel.findOne({ text: 'hi' })
    const endpoint = `/messages/${message._id}`

    const response = await request(server)
      .get(endpoint)
      .set('authorization', user.token)
      .expect(200)

    expect(response.body.text).toEqual('hi')
    expect(response.body.author).toEqual('test')
  })

  it('(Update) PUT /messages/:id', async () => {
    const message = await MessageModel.findOne({ text: 'hi' })
    const endpoint = `/messages/${message._id}`

    const response = await request(server)
      .put(endpoint)
      .set('authorization', user.token)
      .send({ text: 'new hi' })
      .expect(200)

    expect(response.body.text).toEqual('new hi')
    expect(await MessageModel.findOne({ text: 'new hi' })).not.toBeNull()
  })

  it('(Delete) DELETE /messages/:id', async () => {
    const message = await MessageModel.findOne({ text: 'new hi' })
    const endpoint = `/messages/${message._id}`

    await request(server)
      .delete(endpoint)
      .set('authorization', user.token)
      .expect(204)

    expect(await MessageModel.findOne({ text: 'new hi' })).toBeNull()
  })
})
