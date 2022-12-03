import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MessageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { UserModel } from '@/models/User'
import {
  baseUserTelegramm,
  messageChanged,
  messageInvalid,
  messageTest,
  messageTestError,
} from '@/__tests__/testUtils'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Testing message controller', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let token: string
  let message_id: string
  let user_id: string
  let userCreate
  let message

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()

    userCreate = await UserModel.create({
      ...baseUserTelegramm,
    })
    token = !userCreate.token ? '' : userCreate.token

    message = await MessageModel.create({
      text: messageTest.text,
      author: userCreate,
    })

    message_id = String(message._id)
    user_id = String(userCreate.id)
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

  it('creates message successfully', async () => {
    await request(server)
      .post('/message')
      .set('token', token)
      .send(messageTest)
      .expect(200)

    const messageInfo = await MessageModel.findOne({
      author: user_id,
      messageTest,
    })

    expect(Boolean(messageInfo)).toBe(true)
    expect(String(!messageInfo ? null : messageInfo.author)).toBe(user_id)
    expect(!messageInfo ? null : messageInfo.text).toBe(messageTest.text)
  })

  it('validation error successfully', async () => {
    const messageInfoRes = await request(server)
      .post('/message')
      .set('token', token)
      .set('Accept', 'application/json')
      .send(messageTestError)
      .expect(422)

    const messageInfo = messageInfoRes.body

    expect(messageInfo.errorDetails[0].field).toBe('text')
    expect(messageInfo.errorDetails[0].violations.isString).toBe(
      'text must be a string'
    )
  })

  it('gets message successfully', async () => {
    const messageInfoRes = await request(server)
      .get('/message/' + message_id)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(200)

    const messageInfo = messageInfoRes.body

    expect(Boolean(messageInfo)).toBe(true)
    expect(messageInfo._id).toBe(message_id)
    expect(messageInfo.text).toBe(messageTest.text)
  })

  it('get all author messages successfully', async () => {
    await request(server)
      .post('/message')
      .set('token', token)
      .set('Accept', 'application/json')
      .send(messageTest)

    const messageInfoRes = await request(server)
      .get('/message/')
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(200)

    const messageInfo = messageInfoRes.body
    expect(Boolean(messageInfo)).toBe(true)
    expect(messageInfo.length).toBe(2)
  })

  it('updates message successfully', async () => {
    await request(server)
      .put('/message/' + message_id)
      .set('token', token)
      .send(messageChanged)
      .expect(200)

    const messageInfo = await MessageModel.findById(message_id)

    expect(Boolean(messageInfo)).toBe(true)
    expect(!messageInfo ? null : messageInfo.id).toBe(message_id)
    expect(!messageInfo ? null : messageInfo.text).toBe(messageChanged.text)
  })

  it('delete message successfully', async () => {
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

    const messageInfo = await MessageModel.findById(message_id)
    expect(messageInfo).toBe(null)
  })

  it('gets 404 successfully', async () => {
    await request(server)
      .get('/message/' + messageInvalid.id)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(404)
  })
})
