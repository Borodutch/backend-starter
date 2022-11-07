import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MessagesModel } from '@/models/MessagesModel'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD test', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  let token: string
  let author: string
  let messageId: string

  const text = 'Text'
  const textForPost = { text: 'This is post text' }
  const putText = { text: 'Updated text' }
  const wrongToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjc5NTAxMGI4YTQ4YzUxMDU2ZGI0MSIsImlhdCI6MTY2NzczMjczN30.ZBAPzUrBB0EUOrVCR83x-2GPX8tvaCSQz_92fJVXsxs'

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    const user = {
      email: 'qwerty@sada.com',
      name: 'one',
    }

    const response = await request(server).post('/login/email').send(user)
    token = response.body.token
    author = response.body._id
    const message = await MessagesModel.create({ text, author })
    messageId = message._id
  })

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
  })

  afterAll(async () => {
    shutdown(server)
    await mongoServer.stop()
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  it('make get request with token', async () => {
    const response = await request(server).get('/messages').set('token', token)
    expect(response.body[0].author).toBe(author)
    expect(response.statusCode).toBe(200)
  })

  it('makes get request without token', async () => {
    const responce = await request(server).get('/messages').send()
    expect(responce.statusCode).toBe(401)
  })

  it('make get request with wrong token', async () => {
    const responce = await request(server)
      .get('/messages')
      .set('token', wrongToken)
    expect(responce.statusCode).toBe(403)
  })

  it('make post request with Token', async () => {
    const response = await request(server)
      .post('/messages')
      .send(textForPost)
      .set('token', token)
    expect(response.statusCode).toBe(200)

    const newMessageId = response.body._id
    const newMessage = await MessagesModel.findById(newMessageId)

    expect(newMessage).not.toBeNull()
    expect(newMessage?.text).toBe(textForPost.text)
    expect(newMessage?.author).toBeInstanceOf(Object)
    expect(newMessage?.author?.toString()).toBe(author)
  })

  it('makes post request with wrong token', async () => {
    const responce = await request(server)
      .post('/messages')
      .send(textForPost)
      .set('token', wrongToken)
    expect(responce.statusCode).toBe(403)
  })

  it('makes post request without token', async () => {
    const responce = await request(server).post('/messages').send(textForPost)
    expect(responce.statusCode).toBe(401)
  })

  it('make update request with token', async () => {
    const response = await request(server)
      .put(`/messages/${messageId}`)
      .send(putText)
      .set('token', token)

    expect(response.statusCode).toBe(200)

    const updatedMessage = await MessagesModel.findById(messageId)
    expect(updatedMessage?.text).toBe(putText.text)
  })

  it('makes update with wrong token', async () => {
    await request(server)
      .put(`/messages/${messageId}`)
      .send(putText)
      .set('token', wrongToken)
      .expect(403)
  })

  it('makes update without token', async () => {
    const responce = await request(server)
      .put(`/messages/${messageId}`)
      .send(putText)
    expect(responce.statusCode).toBe(401)
  })

  it('make delete request with token', async () => {
    const response = await request(server)
      .delete(`/messages/${messageId}`)
      .set('token', token)

    expect(response.statusCode).toBe(200)

    const deletedMessage = await MessagesModel.findById(response.body._id)
    expect(deletedMessage).toBeNull()
  })

  it('make delete request with wrong token', async () => {
    await request(server)
      .delete(`/messages/${messageId}`)
      .set('token', wrongToken)
      .expect(403)
  })

  it('make delete request without token', async () => {
    const responce = await request(server)
      .put(`/messages/${messageId}`)
      .send(putText)
    expect(responce.statusCode).toBe(401)
  })
})
