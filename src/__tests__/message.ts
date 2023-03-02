import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MessageModel } from '@/models/Messages'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { User, findOrCreateUser } from '@/models/User'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Message endpoint', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let user: User
  let token: string

  const testingMessageMock = {
    text: 'Some text',
  }

  const testingMessage2Mock = {
    text: 'Edited text',
  }

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()

    const testingUserMock = {
      name: 'John Doe',
      email: 'john@doe.com',
    }

    user = await findOrCreateUser(testingUserMock)
    if (!user.token) {
      throw new Error('token not received')
    }
    token = user.token
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

  it('should return Forbidden 403', async () => {
    const response = await request(server).get('/messages')
    expect(response.statusCode).toBe(403)
  })

  it('should return Bad request 400', async () => {
    const messageId = 'bad_id'
    const response = await request(server)
      .get(`/messages/${messageId}`)
      .set('token', token)
    expect(response.statusCode).toBe(400)
  })

  it('should return Not Found 404', async () => {
    const messageId = mongoose.Types.ObjectId.toString()
    const response = await request(server)
      .get(`/messages/${messageId}`)
      .set('token', token)
    expect(response.statusCode).toBe(404)
  })

  it('should return new message', async () => {
    const response = await request(server)
      .post(`/messages`)
      .set('token', token)
      .send(testingMessageMock)
    expect(response.statusCode).toBe(200)
    expect(response.body.text).toBe(testingMessageMock.text)
    const message = await MessageModel.findById(response.body._id)
    if (!message) {
      throw new Error('message not found')
    }
    expect(message.text).toBe(testingMessageMock.text)
  })

  it('should return exist message', async () => {
    const message = await MessageModel.create({
      text: testingMessageMock.text,
      author: user,
    })
    const response = await request(server)
      .get(`/messages/${message.id}`)
      .set('token', token)
    expect(response.body.text).toBe(testingMessageMock.text)
  })

  it('should return edited message', async () => {
    const message = await MessageModel.create({
      text: testingMessageMock.text,
      author: user,
    })
    const response = await request(server)
      .put(`/messages/${message.id}`)
      .send(testingMessage2Mock)
      .set('token', token)
    expect(response.body.text).toBe(testingMessage2Mock.text)
    const editedMessage = await MessageModel.findById(message.id)
    if (!editedMessage) {
      throw new Error('message not found')
    }
    expect(editedMessage.text).toBe(testingMessage2Mock.text)
  })

  it('should return deleted message', async () => {
    const message = await MessageModel.create({
      text: testingMessageMock.text,
      author: user,
    })
    const response = await request(server)
      .delete(`/messages/${message.id}`)
      .set('token', token)
    expect(response.statusCode).toBe(200)
    const deletedMessage = await MessageModel.findById(message.id)
    expect(deletedMessage).toBeNull()
  })
})
