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
  let author: User
  let token: string
  let id: ObjectId
  let authorId: ObjectId

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

  it('should create new user', async () => {
    const user = {
      name: '1',
      email: 'email@google.com',
    }
    const response = await request(server).post('/login/email').send(user)
    authorId = response.body._id
    token = response.body.token
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
      .set('token', token)
    message = response.body
    id = response.body._id
    console.log(response.error)
    expect(response.body.text).toBe(message.text)
    expect(response.body.author._id).toBe(authorId)
  })

  it('should get and return message', async () => {
    const response = await request(server)
      .get(`/message/${id}`)
      .set('token', token)
    console.log(response.error)
    expect(response.body.text).toBe(message.text)
    expect(response.body.author).toBe(authorId)
  })

  it('should update message', async () => {
    const newMessage = { text: 'now i am Message!' }
    const response = await request(server)
      .patch(`/message/${id}`)
      .send(newMessage)
      .set('token', token)
    console.log(response.error)
    expect(response.body.text).toBe(newMessage.text)
    expect(response.body.author).toBe(authorId)
  })

  it('should delete message', async () => {
    const response = await request(server)
      .delete(`/message/${id}`)
      .set('token', token)
    console.log(response.error)
    expect(response.body.text).toBe(message.text)
    expect(response.body.author).toBe(authorId)
  })

  it('should try delete message again', async () => {
    await request(server).delete(`/message/${id}`).set('token', token)
    expect(404)
  })
})
