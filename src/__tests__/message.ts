import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { Message } from '@/models/Message'
import { MessageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { User, findOrCreateUser } from '@/models/User'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Message controller', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()
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

  describe('GET /', () => {
    let user_1: User
    let user_2: User
    let user_3: User
    let message_1: Message
    let message_2: Message

    beforeEach(async () => {
      await mongoose.connection.db.dropDatabase()

      user_1 = await findOrCreateUser({ name: 'User 1' })
      user_2 = await findOrCreateUser({ name: 'User 2' })
      user_3 = await findOrCreateUser({ name: 'User 3' })

      message_1 = await MessageModel.create({
        text: 'Text 1',
        author: user_1._id,
      })
      message_2 = await MessageModel.create({
        text: 'Text 3',
        author: user_2._id,
      })
    })

    it("should return user's messages", async () => {
      const response_1 = await request(server)
        .get('/message/')
        .set('token', user_1.token ? user_1.token : 'token')
      expect(response_1.body[0]._id).toBe(message_1._id.toString())

      const response_2 = await request(server)
        .get('/message/')
        .set('token', user_2.token ? user_2.token : 'token')
      expect(response_2.body[0]._id).toBe(message_2._id.toString())

      const response_3 = await request(server)
        .get('/message/')
        .set('token', user_3.token ? user_3.token : 'token')
      expect(response_3.body.length).toEqual(0)
    })
  })

  describe('GET /:id', () => {
    let user: User
    let message: Message

    beforeEach(async () => {
      await mongoose.connection.db.dropDatabase()

      user = await findOrCreateUser({ name: 'User 1' })

      message = await MessageModel.create({
        text: 'Text',
        author: user._id,
      })
    })

    it('should return message by id', async () => {
      const response = await request(server)
        .get(`/message/${message._id.toString()}`)
        .set('token', user.token ? user.token : 'token')
      expect(response.body._id).toBe(message._id.toString())
    })
  })

  describe('POST /', () => {
    let user: User

    beforeEach(async () => {
      await mongoose.connection.db.dropDatabase()

      user = await findOrCreateUser({ name: 'User' })
    })

    it('should add message', async () => {
      const text = 'text'
      const response = await request(server)
        .post('/message/')
        .send({ text })
        .set('token', user.token ? user.token : 'token')

      expect(response.body).toHaveProperty('_id')

      const added_message = await MessageModel.findById(response.body._id)

      expect(added_message ? added_message.text : null).toEqual(text)
    })
  })

  describe('PUT /:id', () => {
    let user: User
    let message: Message

    beforeEach(async () => {
      await mongoose.connection.db.dropDatabase()

      user = await findOrCreateUser({ name: 'User' })
      message = await MessageModel.create({
        text: 'Text',
        author: user._id,
      })
    })

    it('should edit message', async () => {
      const text = 'Edited'
      await request(server)
        .put(`/message/${message._id.toString()}`)
        .send({ text })
        .set('token', user.token ? user.token : 'token')

      const edited_message = await MessageModel.findById(message._id)

      expect(edited_message ? edited_message.text : null).toEqual(text)
    })

    it('new text should not be empty', async () => {
      const text = ''
      const response = await request(server)
        .put(`/message/${message._id.toString()}`)
        .send({ text })
        .set('token', user.token ? user.token : 'token')

      expect(response.statusCode).toBe(422)
    })
  })

  describe('DELETE /:id', () => {
    let user: User
    let message: Message

    beforeEach(async () => {
      await mongoose.connection.db.dropDatabase()

      user = await findOrCreateUser({ name: 'User' })
      message = await MessageModel.create({
        text: 'Text',
        author: user._id,
      })
    })

    it('should delete message', async () => {
      await request(server)
        .delete(`/message/${message._id.toString()}`)
        .set('token', user.token ? user.token : 'token')

      const deleted_message = await MessageModel.findById(message._id)

      expect(deleted_message).toBeNull()
    })
  })
})
