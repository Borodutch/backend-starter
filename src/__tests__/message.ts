import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MessageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { User, UserModel } from '@/models/User'
import {
  baseUserTelegramm,
  messageChanged,
  messageInvalid,
  messageTest,
} from '@/__tests__/testUtils'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Testing message controller', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let UserCreate: User
  let token: string
  let message_id: string
  let message

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()

    UserCreate = await UserModel.create({
      ...baseUserTelegramm,
    })
    token = !UserCreate.token ? '' : UserCreate.token

    message = await MessageModel.create({
      text: messageTest.text,
      author: UserCreate,
    })

    message_id = String(message._id)
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
    const messageInfoRes = await request(server)
      .post('/message')
      .set('token', token)
      .set('Accept', 'application/json')
      .send(messageTest)
      .expect(200)

    const messageInfo = JSON.parse(messageInfoRes.text)

    expect(Boolean(messageInfo)).toBe(true)
    expect(messageInfo.author.token).toBe(UserCreate.token)
    expect(messageInfo.text).toBe(messageTest.text)
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
    expect(messageInfo.text).toBe(messageTest.text)
  })

  it('metod message Update', async () => {
    const messageInfoRes = await request(server)
      .put('/message/' + message_id)
      .set('token', token)
      .set('Accept', 'application/json')
      .send(messageChanged)
      .expect(200)

    const messageInfo = JSON.parse(messageInfoRes.text)

    expect(Boolean(messageInfo)).toBe(true)
    expect(messageInfo._id).toBe(message_id)
    expect(messageInfo.text).toBe(messageChanged.text)
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
    await request(server)
      .get('/message/' + messageInvalid.id)
      .set('token', token)
      .set('Accept', 'application/json')
      .expect(404)
  })
})
