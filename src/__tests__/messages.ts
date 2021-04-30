process.env.JWT = '123'

const request = require('supertest')
import { app } from '@/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import { Server } from 'http'
import { startKoa, stopServer } from './testUtils'
import { MessageModel } from '@/models/message'
import { User, getOrCreateUser } from '@/models/user'
import { DocumentType } from '@typegoose/typegoose'

const mongoServer = new MongoMemoryServer()

describe('Login endpoint', () => {
  let server: Server
  let user: DocumentType<User>

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
    user = await getOrCreateUser({ name: 'test', email: 'test@gmail.com' })
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('should add message', async () => {
    await request(server)
      .post('/messages')
      .set({ token: user.token })
      .send({ message: 'Lorem ipsum' })

    const message = await MessageModel.find()

    expect(message.length).toBe(1)
    expect(message[0].text).toBe('Lorem ipsum')
    expect(message[0].userId).toBe(user._id.toString())
  })

  it('should get all messages', async () => {
    await MessageModel.create({
      text: 'Test',
      userId: user._id,
      _doc: '1',
    })

    const response = await request(server)
      .get('/messages')
      .set({ token: user.token })

    const message = await MessageModel.find()

    expect(response.body.length).toBe(2)
    expect(response.body[0].text).toBe(message[0].text)
    expect(response.body[0].userId).toBe(message[0].userId)
  })

  it('should get single message', async () => {
    const message = await MessageModel.find()

    const response = await request(server)
      .get(`/messages/${message[0]._id}`)
      .set({ token: user.token })

    expect(response.body.text).toBe(message[0].text)
    expect(response.body.userId).toBe(message[0].userId)
  })

  it('should update message', async () => {
    let messages = await MessageModel.find()

    await request(server)
      .put('/messages')
      .set({ token: user.token })
      .send({ id: messages[0]._id, message: 'Updated' })

    messages = await MessageModel.find()

    expect(messages[0].text).toBe('Updated')
  })

  it('should delete message', async () => {
    let messages = await MessageModel.find()
    const messageId = messages[0]._id

    await request(server)
      .delete(`/messages/${messageId}`)
      .set({ token: user.token })

    messages = await MessageModel.find()

    const deleted = await MessageModel.findById(messageId)

    expect(messages.length).toBe(1)
    expect(deleted).toBeNull
  })
})
