import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Send message', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let testUser = { name: 'Johnny Sins', email: 'sins@johnny.com' }
  let token: null
  let testText = { text: 'London is the capital of GB' }
  let updatedText = { text: 'This message was updated' }

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase()
    await shutdown(server)
    await mongoServer.stop()
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  it('should return user with token for valid /email request', async () => {
    const response = await request(server).post('/login/email').send(testUser)
    expect(response.body.name).toBe(testUser.name)
    expect(response.body.email).toBe(testUser.email)
    expect(response.body.token).toBeTruthy()
  })

  describe('REST methods for CRUD messages', () => {
    it('should create message for valid /message request', async () => {
      const responseForLogin = await request(server)
        .post('/login/email')
        .send(testUser)
      token = responseForLogin.body.token
      const response = await request(server)
        .post('/message')
        .set({ token: token })
        .send(testText)
      expect(response.body.text).toBe(testText.text)
    })

    describe('GET method', () => {
      it('should find message with proper id for proper author', async () => {
        const responseForLogin = await request(server)
          .post('/login/email')
          .send(testUser)
        token = responseForLogin.body.token
        const responseWithMessage = await request(server)
          .post('/message')
          .set({ token: token })
          .send(testText)
        const messageId = responseWithMessage.body._id
        const response = await request(server)
          .get(`/message/${messageId}`)
          .set({ token: token })
        expect(response.body.text).toBe(responseWithMessage.body.text)
      })

      it('should return proper error for inappropriate token', async () => {
        const responseForLogin = await request(server)
          .post('/login/email')
          .send(testUser)
        token = responseForLogin.body.token
        const responseWithMessage = await request(server)
          .post('/message')
          .set({ token: token })
          .send(testText)
        const messageId = responseWithMessage.body._id
        const response = await request(server)
          .get(`/message/${messageId}`)
          .set({ token: 'somerandomtoken' })
        expect(response.body.error).toBe('Bad Request')
        expect(response.body.message).toBe('No user with such token')
      })

      it('should return proper error for missed token', async () => {
        const responseForLogin = await request(server)
          .post('/login/email')
          .send(testUser)
        token = responseForLogin.body.token
        const responseWithMessage = await request(server)
          .post('/message')
          .set({ token: token })
          .send(testText)
        const messageId = responseWithMessage.body._id
        const responseForGet = await request(server).get(
          `/message/${messageId}`
        )
        expect(responseForGet.body.error).toBe('Bad Request')
        expect(responseForGet.body.message).toBe('No user token provided')
      })
    })

    it('should update existing message', async () => {
      const responseForLogin = await request(server)
        .post('/login/email')
        .send(testUser)
      token = responseForLogin.body.token
      const responseWithMessage = await request(server)
        .post('/message')
        .set({ token: token })
        .send(testText)
      const messageId = responseWithMessage.body._id
      const responseForPut = await request(server)
        .put(`/message/${messageId}`)
        .set({ token: token })
        .send(updatedText)
      expect(responseForPut.body.text).toBe(updatedText.text)
    })

    it('should delete existing message', async () => {
      const responseForLogin = await request(server)
        .post('/login/email')
        .send(testUser)
      token = responseForLogin.body.token
      const responseWithMessage = await request(server)
        .post('/message')
        .set({ token: token })
        .send(testText)
      const messageId = responseWithMessage.body._id
      const responseForDelete = await request(server)
        .delete(`/message/${messageId}`)
        .set({ token: token })
      const responseForAccessingDeleted = await request(server)
        .get(`/message/${messageId}`)
        .set({ token: token })
      expect(responseForAccessingDeleted.statusCode).toBe(404)
    })
  })
})
