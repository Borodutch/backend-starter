import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import MessageModel from '@/models/Message'
import { UserModel } from '@/models/User'
import MongoId from '@/validators/MongoId'

describe('CRUD testing', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let token: string
  let messageId: MongoId

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()

    const author = {
      name: 'John Doe',
      email: 'John@Doe.com',
    }

    const visiter = {
      name: 'Jane Smith',
      email: 'Jane@Smith.com',
    }

    const response = await request(server).post('/login/register').send(author)
    token = response.body.token

    const messageMock = { text: 'the first message' }
    const responseMessage = await request(server)
      .post('/message')
      .send(messageMock)
      .set('token', token)

    messageId = responseMessage.body._id
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

  describe('GET /message', () => {
    it('should return all messages from database', async () => {
      const response = await request(server).get('/message').set('token', token)
      console.log(response.body)
    })
  })

  describe('POST /message', () => {
    it('should create a new message in database', async () => {
      const messageMock = { text: 'POST testing' }

      const response = await request(server)
        .post('/message')
        .send(messageMock)
        .set('token', token)

      const message = await MessageModel.findOne(messageMock)

      expect(response.body._id).toBe(message?.id)
      expect(response.body.text).toBe(message?.text)
    })

    describe('PUT /message', () => {
      it('should update the message in database', async () => {
        const updateText = { text: 'PUT testing' }
        const response = await request(server)
          .put(`/message/${messageId}`)
          .send(updateText)
          .set('token', token)

        const message = await MessageModel.findById(messageId)

        expect(response.body._id).toBe(message?.id)
        expect(response.body.text).toBe(message?.text)
      })
    })

    describe('DELETE /message', () => {
      it('should delete the message from database', async () => {
        await request(server)
          .delete(`/message/${messageId}`)
          .set('token', token)

        const message = await MessageModel.findById(messageId)

        expect(message).toBeNull()
      })
    })
  })
})
