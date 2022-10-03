import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MessageModel } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD test', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  const user = {
    email: 'testcrud@gmail.com',
    name: 'crudTest',
  }

  let token: string
  let author: string
  let messageId: string

  const text = 'yoba, eto ti?'
  const postText = 'hello yoba'
  const putText = 'da, eto ya!'

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    const response = await request(server).post('/login/email').send(user)
    token = response.body.token
    author = response.body._id
    const message = await MessageModel.create({ text, author })
    messageId = message._id
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

  it('testing GET', async () => {
    const response = await request(server).get('/crud').set('token', token)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0].text).toBe('yoba, eto ti?')
    expect(response.body[0].author).toBe(author)
  })

  it('testing POST', async () => {
    const response = await request(server)
      .post('/crud')
      .send({ text: postText })
      .set('token', token)

    expect(response.body.text).toBe(postText)
    expect(response.body.author._id).toBe(author)
  })

  it('testing PUT', async () => {
    const response = await request(server)
      .put(`/crud/${messageId}`)
      .send({ text: putText })
      .set('token', token)

    expect(response.body.text).toBe(text)

    const updatedMessage = await MessageModel.findById(messageId)
    expect(updatedMessage?.text).toBe(putText)
  })

  it('testing DELETE', async () => {
    const response = await request(server)
      .delete(`/crud/${messageId}`)
      .set('token', token)

    expect(response.body.text).toBe(text)

    const deletedMessage = await MessageModel.findById(messageId)
    expect(deletedMessage).toBeNull()
  })
})
