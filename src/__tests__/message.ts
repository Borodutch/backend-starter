import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { DocumentType } from '@typegoose/typegoose'
import { Message, MessageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import { User, findOrCreateUser } from '@/models/User'
import { forbidden, unauthorized } from '@hapi/boom'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Message endpoint', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let userA: DocumentType<User>
  let userB: DocumentType<User>
  let testMessage: DocumentType<Message>
  let userAToken: string
  let userBToken: string

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await runMongo(await mongoServer.getUri())
    server = await runApp()

    userA = await findOrCreateUser({
      name: 'John Doe',
      email: 'johndoe@mail.com',
    })
    userB = await findOrCreateUser({
      name: 'Jane Doe',
      email: 'janedoe@mail.com',
    })
    if (userA.token && userB.token) {
      userAToken = userA.token
      userBToken = userB.token
    }
    testMessage = await MessageModel.create({ author: userA, text: 'TestA' })
    await MessageModel.create({ author: userA, text: 'TestB' })
    await MessageModel.create({ author: userB, text: 'TestC' })
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

  describe('GET without token', () => {
    it('Should return 401', async () => {
      const { statusCode, body } = await request(server).get('/message')
      expect(statusCode).toBe(401)
      expect(body.message).toBe(unauthorized('Token is absent').message)
    })
  })
  describe('GET with wrong token', () => {
    it('Should return 403', async () => {
      const { statusCode, body } = await request(server)
        .get('/message')
        .set('token', '123')
      expect(statusCode).toBe(403)
      expect(body.message).toBe(forbidden('Invalid token').message)
    })
  })
  describe('POST /message/create', () => {
    it('Should creat and return message', async () => {
      const { statusCode, body } = await request(server)
        .post('/message/create')
        .send({ text: 'New test message' })
        .set('token', userAToken)
      expect(statusCode).toBe(200)
      const message = await MessageModel.findOne(body)
      expect(message).resolves
      expect([body._id, body.text, body.author._id]).toEqual([
        message?.id.toString(),
        message?.text,
        message?.author?.toString(),
      ])
    })
  })
  describe('GET /message', () => {
    it('Should return all messages for current user', async () => {
      const userMessages = await MessageModel.find({ author: userA })
      const { statusCode, body } = await request(server)
        .get('/message')
        .set('token', userAToken)
      expect(statusCode).toBe(200)
      expect(body).toHaveLength(3)
      expect(body[0].text).toBe(userMessages[0].text)
      expect(body[1].text).toBe(userMessages[1].text)
      expect(body[2].text).toBe(userMessages[2].text)
    })
  })
  describe('GET /message/id', () => {
    it('Should return requested message', async () => {
      const { statusCode, body } = await request(server)
        .get(`/message/${testMessage.id}`)
        .set('token', userAToken)
      expect(statusCode).toBe(200)
      expect(body.text).toEqual(testMessage.text)
    })
    it('Should return 403 because of different author', async () => {
      const { statusCode } = await request(server)
        .get(`/message/${testMessage.id}`)
        .set('token', userBToken)
      expect(statusCode).toBe(403)
    })
  })
  describe('DELETE /message/id', () => {
    it('Should delete message with specific id', async () => {
      const deleteRequest = await request(server)
        .delete(`/message/${testMessage.id}`)
        .set('token', userAToken)
      expect(deleteRequest.statusCode).toBe(200)
      const getRequest = await request(server)
        .get(`/message/${testMessage.id}`)
        .set('token', userAToken)
      expect(getRequest.statusCode).toBe(403)
    })
  })
  describe('DELETE /message', () => {
    it('Should delete all user messages', async () => {
      const deleteRequest = await request(server)
        .delete(`/message/`)
        .set('token', userAToken)
      expect(deleteRequest.statusCode).toBe(200)
      const getRequest = await request(server)
        .get(`/message`)
        .set('token', userAToken)
      expect(getRequest.body.length).toBe(0)
    })
  })
})
