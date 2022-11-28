import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { DocumentType } from '@typegoose/typegoose'
import { Message, messageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import { User, findOrCreateUser } from '@/models/User'
import { notFound, unauthorized } from '@hapi/boom'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Message endpoint', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let firstUser: DocumentType<User>
  let secondUser: DocumentType<User>
  let message: DocumentType<Message>

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await runMongo(await mongoServer.getUri())
    server = await runApp()

    firstUser = await findOrCreateUser({
      name: 'izanami',
      email: 'izanami@Doe.com',
    })
    firstUser.strippedAndFilled({ withExtra: true })

    secondUser = await findOrCreateUser({
      name: 'izanagi',
      email: 'izanagi@Smith.com',
    })
    secondUser.strippedAndFilled({ withExtra: true })

    message = await messageModel.create({
      text: 'test message',
      author: firstUser.id,
    })
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

  describe('Get access without authenticate', () => {
    it('should return invalid token error if no token provided or it`s wrong', async () => {
      const { statusCode, body } = await request(server).get('/message')

      expect(statusCode).toBe(401)
      expect(body.message).toBe(unauthorized('invalid token').message)
    })
  })

  describe('GET /message', () => {
    it('should return all messages from database', async () => {
      await messageModel.create({
        text: 'author message',
        author: firstUser.id,
      })
      const messages = await messageModel.find()

      const { statusCode, body } = await request(server)
        .get('/message')
        .set('token', firstUser.token)

      expect(JSON.stringify(body)).toBe(JSON.stringify(messages))
      expect(statusCode).toBe(200)
    })

    it('should return no messages for users who isn`t author', async () => {
      const { statusCode, body } = await request(server)
        .get('/message')
        .set('token', secondUser.token)

      expect(body).toHaveLength(0)
      expect(statusCode).toBe(200)
    })
  })

  describe('GET /message/id', () => {
    it('should return one message from database', async () => {
      const getMessage = await messageModel.findById(message.id)

      const { statusCode, body } = await request(server)
        .get(`/message/${message.id}`)
        .set('token', firstUser.token)

      expect(JSON.stringify(body)).toBe(JSON.stringify(getMessage))
      expect(statusCode).toBe(200)
    })

    it('should return no messages for users who isn`t author', async () => {
      const { statusCode, body } = await request(server)
        .get('/message')
        .set('token', secondUser.token)

      expect(body).toHaveLength(0)
      expect(statusCode).toBe(200)
    })
  })

  describe('POST /message', () => {
    it('should create a new message in database', async () => {
      const messageText = { text: 'POST testing' }
      const { statusCode, body } = await request(server)
        .post('/message')
        .send(messageText)
        .set('token', firstUser.token)

      const postMessage = await messageModel.findOne(messageText)

      expect(body._id).toBe(postMessage?.id)
      expect(body.text).toBe(postMessage?.text)
      expect(statusCode).toBe(200)
    })
  })

  describe('PUT /message', () => {
    it('should update the message in database', async () => {
      const updateMessage = { text: 'Put message' }
      const { statusCode, body } = await request(server)
        .put(`/message/${message.id}`)
        .set('token', firstUser.token)
        .send(updateMessage)

      expect(body._id).toBe(message.id)
      expect(body.text).toBe(updateMessage.text)
      expect(statusCode).toBe(200)
    })

    it('should return not found error message if second user tries to change the message', async () => {
      const updateMessage = { text: 'Put message' }
      const { statusCode, body } = await request(server)
        .put(`/message/${message.id}`)
        .send(updateMessage)
        .set('token', secondUser.token)

      expect(body.message).toBe(notFound('message was not found').message)
      expect(statusCode).toBe(404)
    })
  })

  describe('DELETE /message', () => {
    it('should delete the message from database', async () => {
      const { statusCode, body } = await request(server)
        .delete(`/message/${message.id}`)
        .set('token', firstUser.token)

      const deletedMessage = await messageModel.findByIdAndDelete(message.id)

      expect(deletedMessage).toBeNull()
      expect(body._id).toBe(message.id)
      expect(statusCode).toBe(200)
    })

    it('should return not found error message if second user tries to delete the message', async () => {
      const { statusCode, body } = await request(server)
        .delete(`/message/${message.id}`)
        .set('token', secondUser.token)

      expect(body.message).toBe(notFound('message was not found').message)
      expect(statusCode).toBe(404)
    })
  })
})
