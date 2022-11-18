import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { Message, MessageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { User, UserModel } from '@/models/User'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Testing message controller', () => {
  new MockAdapter(axios)
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let UserCreate: User
  let token: string
  let message_id: string
  let message
  let text: string

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()

    const baseUserTelegramm = {
      telegramId: 121561060,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjE0MjkzMTlhOGEyNTMwZGE5YWFlNyIsImlhdCI6MTY2NzMxODQxOX0.MqcyKuav0QNLzoDXJoVT7ECPN_iXk1yb6wUL7Xn7DrY',
      name: 'Test user Jest',
    }

    UserCreate = await UserModel.create({
      ...baseUserTelegramm,
    })
    token = !UserCreate.token ? '' : UserCreate.token

    message = await MessageModel.create({
      text: 'text for test',
      author: UserCreate,
    })

    message_id = String(message._id)
    text = message.text
  })

  afterAll(async () => {
    await shutdown(server)
    await mongoServer.stop()
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  it('metod message Create', async () => {
    const testingMessage = {
      text: 'text for test',
    }

    const messageInfoRes = await request(server)
      .post('/message')
      .set('token', token)
      .set('Accept', 'application/json')
      .send(testingMessage)
      .expect(200)

    const messageInfo = JSON.parse(messageInfoRes.text)

    expect(Boolean(messageInfo)).toBe(true)
    expect(messageInfo.author.token).toBe(UserCreate.token)
    expect(messageInfo.text).toBe(testingMessage.text)
  })

  it('metod message Get', async () => {
    const messageInfoRes = await request(server)
      .get('/message/' + message_id)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(200)

    const messageInfo = JSON.parse(messageInfoRes.text)

    expect(Boolean(messageInfo)).toBe(true)
    expect(messageInfo._id).toBe(message_id)
    expect(messageInfo.text).toBe(text)
  })

  it('metod message Update', async () => {
    const сhangedMessage = {
      text: 'text for test сhanged',
    }

    const messageInfoRes = await request(server)
      .put('/message/' + message_id)
      .set('token', token)
      .set('Accept', 'application/json')
      .send(сhangedMessage)
      .expect(200)

    const messageInfo = JSON.parse(messageInfoRes.text)

    expect(Boolean(messageInfo)).toBe(true)
    expect(messageInfo._id).toBe(message_id)
    expect(messageInfo.text).toBe(сhangedMessage.text)
  })

  it('metod message Delete', async () => {
    await request(server)
      .delete('/message/' + message_id)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(200)

    await request(server)
      .get('/message/' + message_id)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(404)
  })

  it('metod message 404 Get', async () => {
    const invalidId = '6377a8f1dc675a8304076832'
    await request(server)
      .get('/message/' + invalidId)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(404)
  })
})
