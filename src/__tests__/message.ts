import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MessageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose, ObjectId } from 'mongoose'
import { Ref } from '@typegoose/typegoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  let token1: string
  let token2: string
  let messageId: ObjectId
  let authorId1: ObjectId

  const user1 = {
    email: 'email1@google.com',
    name: '1',
  }
  const user2 = {
    email: 'email2@google.com',
    name: '2',
  }

  const textMessage = { text: 'hi, i`m test text, or text test... wait...' }
  const UpdatedMessage = { text: 'now i am Message!' }

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    const response1 = await request(server).post('/login/email').send(user1)
    token1 = response1.body.token
    authorId1 = response1.body._id
    const response2 = await request(server).post('/login/email').send(user2)
    token2 = response2.body.token
    const response = await request(server)
      .post('/message/')
      .send(textMessage)
      .set('token', token1)
    messageId = response.body._id
  })

  afterEach(async () => {
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

  it('should create first user', async () => {
    const response = await request(server).post('/login/email').send(user1)
    console.log(response.error)
    expect(response.body.name).toBe(user1.name)
    expect(response.body.email).toBe(user1.email)
  })

  it('should create second user', async () => {
    const response = await request(server).post('/login/email').send(user2)
    console.log(response.error)
    expect(response.body.name).toBe(user2.name)
    expect(response.body.email).toBe(user2.email)
  })

  it('should post message', async () => {
    const response = await request(server)
      .post('/message/')
      .send(textMessage)
      .set('token', token1)
    console.log(response.error)
    expect(response.body.text).toBe(textMessage.text)
    expect(response.body.author._id).toBe(authorId1)
  })

  it('should get and return message', async () => {
    const response = await request(server)
      .get(`/message/${messageId}`)
      .set('token', token1)
    console.log(response.error)
    expect(response.body.text).toBe(textMessage.text)
    expect(response.body.author).toBe(authorId1)
  })

  it(`try get another user's message`, async () => {
    const response = await request(server)
      .get(`/message/${messageId}`)
      .set('token', token2)
    expect(response.statusCode).toBe(404)
  })

  it('should update message', async () => {
    await request(server)
      .patch(`/message/${messageId}`)
      .send(UpdatedMessage)
      .set('token', token1)
    const responseAgain = await request(server)
      .get(`/message/${messageId}`)
      .set('token', token1)
    console.log(responseAgain.error)
    expect(responseAgain.body.text).toBe(UpdatedMessage.text)
    expect(responseAgain.body.author).toBe(authorId1)
  })

  it(`try update another user's message`, async () => {
    await request(server)
      .patch(`/message/${messageId}`)
      .send(UpdatedMessage)
      .set('token', token2)
    const responseAgain = await request(server)
      .get(`/message/${messageId}`)
      .set('token', token2)
    expect(responseAgain.statusCode).toBe(404)
  })

  it('should delete message', async () => {
    await request(server).delete(`/message/${messageId}`).set('token', token1)
    const responseAgain = await request(server)
      .delete(`/message/${messageId}`)
      .set('token', token1)
    expect(responseAgain.statusCode).toBe(404)
  })

  it(`try delete another user's message`, async () => {
    const response = await request(server)
      .delete(`/message/${messageId}`)
      .set('token', token2)
    expect(response.statusCode).toBe(404)
  })
})
