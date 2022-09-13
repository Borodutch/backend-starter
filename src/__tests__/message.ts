import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { Message } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose, ObjectId } from 'mongoose'
import { Server } from 'http'
import { User } from '@/models/User'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  let message: Message
  let token1: string
  let token2: string
  let messageId: ObjectId
  let authorId1: ObjectId
  let authorId2: ObjectId

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
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
    const user = {
      name: '1',
      email: 'email1@google.com',
    }
    const response = await request(server).post('/login/email').send(user)
    authorId1 = response.body._id
    token1 = response.body.token
    console.log(response.error)
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
  })

  it('should create second user', async () => {
    const user = {
      name: '2',
      email: 'email2@google.com',
    }
    const response = await request(server).post('/login/email').send(user)
    token2 = response.body.token
    console.log(response.error)
    expect(response.body.name).toBe(user.name)
    expect(response.body.email).toBe(user.email)
  })

  it('should post message', async () => {
    const textMessage = {
      text: 'hi, i`m test text, or text test... wait...',
    }
    const response = await request(server)
      .post('/message/')
      .send(textMessage)
      .set('token', token1)
    message = response.body
    messageId = response.body._id
    console.log(response.error)
    expect(response.body.text).toBe(textMessage.text)
    expect(response.body.author._id).toBe(authorId1)
  })

  it('should get and return message', async () => {
    const response = await request(server)
      .get(`/message/${messageId}`)
      .set('token', token1)
    console.log(response.error)
    expect(response.body.text).toBe(message.text)
    expect(response.body.author).toBe(authorId1)
  })

  it('should try get message, but return eror 404', async () => {
    await request(server).get(`/message/${messageId}`).set('token', token2)
    expect(404)
  })

  it('should update message, but return old version', async () => {
    const newMessage = { text: 'now i am Message!' }
    const response = await request(server)
      .patch(`/message/${messageId}`)
      .send(newMessage)
      .set('token', token1)
    console.log(response.error)
    expect(response.body.text).toBe(message.text)
    expect(response.body.author).toBe(authorId1)
  })

  it('should get and return new message', async () => {
    const response = await request(server)
      .get(`/message/${messageId}`)
      .set('token', token1)
    message = response.body
    console.log(response.error)
    expect(response.body.text).toBe(message.text)
    expect(response.body.author).toBe(authorId1)
  })

  it('should delete message', async () => {
    const response = await request(server)
      .delete(`/message/${messageId}`)
      .set('token', token1)
    console.log(response.error)
    expect(response.body.text).toBe(message.text)
    expect(response.body.author).toBe(authorId1)
  })

  it('should try delete message again, but return 404', async () => {
    await request(server).delete(`/message/${messageId}`).set('token', token1)
    expect(404)
  })
})
