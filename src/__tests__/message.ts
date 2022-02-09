import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { plainToClass } from 'amala'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD messages', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  afterAll(async () => {
    await shutdown(server)
    await mongoose.connection.db.dropDatabase()
    await mongoServer.stop()
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  const userData = {
    name: 'John Galt',
    email: 'johngalt@mail.com',
    token: '',
  }
  const messageData = {
    text: 'Test text',
    updatedText: 'Updated text',
    messageId: '',
  }

  it('Log in', async () => {
    const user = await request(server)
      .post('/login/email')
      .send({ email: userData.email, name: userData.name })
    userData.token = user.body.token
    expect(user.statusCode).toBe(200)
    expect(user.body.name).toBe(userData.name)
    expect(user.body.email).toBe(userData.email)
  })

  it('Post message', async () => {
    const response = await request(server)
      .post('/message/')
      .set('token', userData.token)
      .send({ text: messageData.text })
    try {
      messageData.messageId = response.body._id
      expect(response.statusCode).toBe(200)
      expect(response.body.text).toBe(messageData.text)
    } catch (error) {
      expect(response.statusCode).toBe(403)
    }
  })

  it('Get message', async () => {
    const response = await request(server)
      .get(`/message/`)
      .set('token', userData.token)
    try {
      expect(response.statusCode).toBe(200)
      expect(response.body[0].text).toBe(messageData.text)
    } catch (error) {
      expect(response.statusCode).toBe(403)
    }
  })

  it('Patch message', async () => {
    const response = await request(server)
      .patch(`/message/${messageData.messageId}`)
      .set('token', userData.token)
      .send({ text: messageData.updatedText })
    try {
      expect(response.statusCode).toBe(200)
      expect(response.body.text).toBe(messageData.updatedText)
    } catch (error) {
      expect(response.statusCode).toBe(404)
    }
  })

  it('Delete message', async () => {
    const response = await request(server)
      .delete(`/message/${messageData.messageId}`)
      .set('token', userData.token)
    try {
      expect(response.statusCode).toBe(200)
      expect(response.body.text).toBe(messageData.updatedText)
    } catch (error) {
      expect(response.statusCode).toBe(404)
    }
  })
})
