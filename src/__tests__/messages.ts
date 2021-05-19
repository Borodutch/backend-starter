const request = require('supertest')
import { app } from '@/app'
import * as mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import { Server } from 'http'
import { completeUser, dropMongo, startKoa, stopServer } from './testUtils'
import { UserModel } from '@/models/user'
import { MessageModel } from '@/models/message'
import { string } from 'joi'
import { sign, verify } from '@/helpers/jwt'

// May require additional time for downloading MongoDB binaries
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

let mongoServer

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
}

let loginByEmailUser = {
  name: 'John',
  email: 'test@mysite.com',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiIsImVtYWlsIjoidGVzdEBteXNpdGUuY29tIiwiaWF0IjoxNjIxNDEyODUxfQ.l4G-VTFPlxV1MU1TWOQqt3X0_U2TAPpO9ch6mT9LJb4',
  _doc: '1',
}

const testMsg1 = 'This is a test message 1'
const testMsg2 = 'This is a test message 2'

const msg = {
  note: testMsg1,
  userId: '',
  _doc: '1',
}

let server: Server

beforeAll(async () => {
  mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getUri()
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) console.error(err)
  })
  server = await startKoa(app)

  const user = await UserModel.create(loginByEmailUser)

  msg.userId = await user._id.toString()
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
  await stopServer(server)
})

describe('CRUD messages endpoint', () => {
  it('should return new message for author', async () => {
    const response = await request(server)
      .post('/messages/messageCreate')
      .set('Authorization', 'Bearer ' + loginByEmailUser.token)
      .send({
        note: testMsg2,
      })

    expect(response.body.note).toBe(testMsg2)
  })

  it('should return list of messages for their author', async () => {
    const newMessage = await MessageModel.create(msg)

    const response = await request(server)
      .get('/messages/messagesList')
      .set('Authorization', 'Bearer ' + loginByEmailUser.token)
      .send()

    expect(response.body[0].note).toBe(testMsg2)
    expect(response.body[1].note).toBe(testMsg1)
  })

  it('should return message by id for author', async () => {
    const id = await (await MessageModel.findOne({ note: testMsg2 }))._id
    const response = await request(server)
      .get('/messages/' + id)
      .set('Authorization', 'Bearer ' + loginByEmailUser.token)
      .send()

    expect(response.body.note).toBe(testMsg2)
  })

  it('should return updated message by id for author', async () => {
    const id = await (await MessageModel.findOne({ note: testMsg2 }))._id
    const response = await request(server)
      .post('/messages/' + id)
      .set('Authorization', 'Bearer ' + loginByEmailUser.token)
      .send({ note: 'Updated' })

    expect(response.body.note).toBe('Updated')
  })

  it('should return deleted message by id for author', async () => {
    const id = await (await MessageModel.findOne({ note: testMsg1 }))._id
    const response = await request(server)
      .delete('/messages/' + id)
      .set('Authorization', 'Bearer ' + loginByEmailUser.token)
      .send()

    expect(response.body.note).toBe(testMsg1)
  })
})
