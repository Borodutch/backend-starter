import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { DocumentType } from '@typegoose/typegoose'
import { Message, MessageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import { User, findOrCreateUser } from '@/models/User'
import { forbidden, unauthorized } from '@hapi/boom'
import mongoose from 'mongoose'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import exp = require('constants')

describe('Message endpoint', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let userA: DocumentType<User>
  let userB: DocumentType<User>
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
    } else {
      throw new Error('No user token presented')
    }
  })

  beforeEach(async () => {
    await MessageModel.deleteMany()
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

  describe('User auth tests:', () => {
    it('Get handler without a token, should return 401', async () => {
      const { statusCode, body } = await request(server).get('/message')
      expect(statusCode).toBe(401)
      expect(body.message).toBe(unauthorized('Token is absent').message)
    })
    it('Get handler with invalid token, should return 403', async () => {
      const { statusCode, body } = await request(server)
        .get('/message')
        .set('token', '123')
      expect(statusCode).toBe(403)
      expect(body.message).toBe(forbidden('Invalid token').message)
    })
  })
  describe('POST handler tests:', () => {
    it('/message/create, should create and return message', async () => {
      const { statusCode, body } = await request(server)
        .post('/message/create')
        .send({ text: 'New test message' })
        .set('token', userAToken)
      expect(statusCode).toBe(200)
      const message = await MessageModel.findOne(body)
      if (!message) {
        throw new Error('Impossible to find the message')
      }
      expect([body._id, body.text, body.author._id]).toEqual([
        message.id.toString(),
        message.text,
        message.author?.toString(),
      ])
    })
  })
  describe('GET handler tests:', () => {
    let testMessage: DocumentType<Message>
    beforeEach(async () => {
      testMessage = await MessageModel.create({ author: userA, text: 'TestA' })
      await MessageModel.create({ author: userA, text: 'TestB' })
      await MessageModel.create({ author: userB, text: 'TestC' })
    })
    it('/message, should return all messages for current user', async () => {
      const userMessages = await MessageModel.find({ author: userA })
      const { statusCode, body } = await request(server)
        .get('/message')
        .set('token', userAToken)
      expect(statusCode).toBe(200)
      expect(body).toHaveLength(2)
      for (let i = 0; i < body.length; i++) {
        expect(body[i].text).toBe(userMessages[i].text)
      }
    })
    it('/message/id, should return requested message', async () => {
      const { statusCode, body } = await request(server)
        .get(`/message/${testMessage.id}`)
        .set('token', userAToken)
      expect(statusCode).toBe(200)
      expect(body.text).toEqual(testMessage.text)
    })
    it('/message/id, should return 403 because of different author', async () => {
      const { statusCode } = await request(server)
        .get(`/message/${testMessage.id}`)
        .set('token', userBToken)
      expect(statusCode).toBe(403)
    })
  })
  describe('DELETE handler tests:', () => {
    let testMessage: DocumentType<Message>
    beforeEach(async () => {
      testMessage = await MessageModel.create({ author: userA, text: 'TestA' })
      await MessageModel.create({ author: userA, text: 'TestB' })
      await MessageModel.create({ author: userA, text: 'TestC' })
    })
    it('/message/id, should delete message with specific id', async () => {
      const deleteRequest = await request(server)
        .delete(`/message/${testMessage.id}`)
        .set('token', userAToken)
      expect(deleteRequest.statusCode).toBe(200)
      const getRequest = await request(server)
        .get(`/message/${testMessage.id}`)
        .set('token', userAToken)
      expect(getRequest.statusCode).toBe(404)
    })
    it('/message, should delete all messages for current user', async () => {
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
  describe('PUT handler tests:', () => {
    let testMessage: DocumentType<Message>
    beforeEach(async () => {
      testMessage = await MessageModel.create({ author: userA, text: 'TestA' })
      await MessageModel.create({ author: userA, text: 'TestB' })
    })
    it('/message/id, should update and return message', async () => {
      const updatedMessage = 'TestPUT'
      const { statusCode, body } = await request(server)
        .put(`/message/${testMessage.id}`)
        .set('token', userAToken)
        .send({ text: updatedMessage })
      expect(statusCode).toBe(200)
      expect(body.text).toBe(updatedMessage)
    })
  })
})
