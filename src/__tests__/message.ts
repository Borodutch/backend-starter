import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MessageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { UserModel } from '@/models/User'
import {
  baseUserTelegram,
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
  let messageId: string
  let userId: string
  let token: string
  let user
  let message

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()

    user = await UserModel.create(baseUserTelegram)

    message = await MessageModel.create({
      text: messageTest.text,
      author: user,
    })

    if (user.token) {
      token = user.token
    }

    messageId = message.id
    userId = user.id
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
    const messageInfoRes = await request(server)
      .post('/message')
      .set('token', token)
      .set('Accept', 'application/json')
      .send(messageTest)
      .expect(200)

    const messageInfo = messageInfoRes.body

    expect(messageInfo).not.toBe(null)
    const message = await MessageModel.findById(messageInfo._id)

    expect(message?.author?.toString()).toBe(userId)
    expect(message?.text).toBe(messageTest.text)
  })

  it('validation MessageTex successfully', async () => {
    const messageInfoRes = await request(server)
      .post('/message')
      .set('token', token)
      .set('Accept', 'application/json')
      .send(messageTestError)
      .expect(422)

    const messageInfo = messageInfoRes.body

    expect(messageInfo).not.toBe(null)
    expect(messageInfo.errorDetails[0].field).toBe('text')
    expect(messageInfo.errorDetails[0].violations.isString).toBe(
      'text must be a string'
    )
  })

  it('gets message successfully', async () => {
    const messageInfoRes = await request(server)
      .get(`/message/${messageId}`)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(200)

    const messageInfo = messageInfoRes.body

    expect(messageInfo).not.toBe(null)
    expect(messageInfo._id).toBe(messageId)
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

    expect(messageInfo).not.toBe(null)
    expect(messageInfo.length).toBe(2)
  })

  it('updates message successfully', async () => {
    await request(server)
      .put(`/message/${messageId}`)
      .set('token', token)
      .send(messageChanged)
      .expect(200)

    const messageInfo = await MessageModel.findById(messageId)

    expect(messageInfo).not.toBe(null)
    expect(messageInfo?.id).toBe(messageId)
    expect(messageInfo?.text).toBe(messageChanged.text)
  })

  it('delete message successfully', async () => {
    await request(server)
      .delete(`/message/${messageId}`)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(200)

    await request(server)
      .get(`/message/${messageId}`)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(404)

    const messageInfo = await MessageModel.findById(messageId)
    expect(messageInfo).toBe(null)
  })

  it('gets 404 successfully', async () => {
    await request(server)
      .get(`/message/${messageInvalid.id}`)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(404)
  })
})
