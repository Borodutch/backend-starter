import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { findOrCreateUser } from '@/models/User'
import { badRequest, notFound } from '@hapi/boom'
import MessageModel from '@/models/Message'
import MongoId from '@/validators/MongoId'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import { sign } from 'jsonwebtoken'

describe('CRUD testing', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let authorToken: string
  let authorId: MongoId
  let noAuthorToken: string
  let firstMessageId: MongoId

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()

    const authorMock = {
      name: 'John Doe',
      email: 'John@Doe.com',
    }

    const author = await findOrCreateUser(authorMock)
    author.strippedAndFilled({ withExtra: true })
    authorId = author._id
    if (typeof author.token === 'string') {
      authorToken = author.token
    }

    const noAuthorMock = {
      name: 'Jane Smith',
      email: 'Jane@Smith.com',
    }

    const noAuthor = await findOrCreateUser(noAuthorMock)
    author.strippedAndFilled({ withExtra: true })
    if (typeof noAuthor.token === 'string') {
      noAuthorToken = noAuthor.token
    }

    const message = await MessageModel.create({
      text: 'the first message',
      author: authorId,
    })
    firstMessageId = message.id
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

      expect(statusCode).toBe(400)
      expect(body.message).toBe(badRequest('invalid token').message)
    })
  })

  describe('GET /message', () => {
    it('should return all messages from database', async () => {
      await MessageModel.create({
        text: 'author message',
        author: authorId,
      })
      const messages = await MessageModel.find()

      const { statusCode, body } = await request(server)
        .get('/message')
        .set('token', authorToken)

      expect(JSON.stringify(body)).toBe(JSON.stringify(messages))
      expect(statusCode).toBe(200)
    })

    it('should return no messages for users who isn`t author', async () => {
      const { statusCode, body } = await request(server)
        .get('/message')
        .set('token', noAuthorToken)

      expect(body).toHaveLength(0)
      expect(statusCode).toBe(200)
    })
  })

  describe('POST /message', () => {
    it('should create a new message in database', async () => {
      const messageMock = { text: 'POST testing' }

      const { statusCode, body } = await request(server)
        .post('/message')
        .send(messageMock)
        .set('token', authorToken)

      const message = await MessageModel.findOne(messageMock)

      expect(body._id).toBe(message?.id)
      expect(body.text).toBe(message?.text)
      expect(statusCode).toBe(200)
    })
  })

  describe('PUT /message', () => {
    it('should update the message in database', async () => {
      const updateText = { text: 'PUT testing' }

      const { statusCode, body } = await request(server)
        .put(`/message/${firstMessageId}`)
        .send(updateText)
        .set('token', authorToken)

      expect(body._id).toBe(firstMessageId)
      expect(body.text).toBe(updateText.text)
      expect(statusCode).toBe(200)
    })

    it('should return not found error message if non-author tries to change the message', async () => {
      const updateText = { text: 'PUT testing' }

      const { statusCode, body } = await request(server)
        .put(`/message/${firstMessageId}`)
        .send(updateText)
        .set('token', noAuthorToken)

      expect(body.message).toBe(notFound('message not found').message)
      expect(statusCode).toBe(404)
    })
  })

  describe('DELETE /message', () => {
    it('should delete the message from database', async () => {
      const { statusCode, body } = await request(server)
        .delete(`/message/${firstMessageId}`)
        .set('token', authorToken)

      const message = await MessageModel.findById(firstMessageId)

      expect(message).toBeNull()
      expect(body._id).toBe(firstMessageId)
      expect(statusCode).toBe(200)
    })

    it('should return not found error message if non-author tries to delete the message', async () => {
      const { statusCode, body } = await request(server)
        .delete(`/message/${firstMessageId}`)
        .set('token', noAuthorToken)

      expect(body.message).toBe(notFound('message not found').message)
      expect(statusCode).toBe(404)
    })
  })
})
