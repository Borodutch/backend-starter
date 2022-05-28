import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD messages', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  afterAll(async () => {
    await shutdown(server)
    await mongoose.connection.db.dropDatabase()
    await mongoServer.stop()
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        err ? reject(err) : resolve()
      })
    })
  })

  const userData = {
    name: 'John Doe',
    email: 'johndoe@mail.com',
    token: '',
  }
  const messageData = {
    text: 'Test text',
    updatedText: 'Updated text',
    messageId: '',
  }

  it('handles correct login', async () => {
    const user = await request(server)
      .post('/login/email')
      .send({ email: userData.email, name: userData.name })
    userData.token = user.body.token
    expect(user.statusCode).toBe(200)
    expect(user.body.name).toBe(userData.name)
    expect(user.body.email).toBe(userData.email)
  })

  it('handles correct post message', async () => {
    const response = await request(server)
      .post('/message/')
      .set('token', userData.token)
      .send({ text: messageData.text })
    messageData.messageId = response.body._id
    expect(response.statusCode).toBe(200)
    expect(response.body.text).toBe(messageData.text)
  })

  it('handles post message with incorrect user token', async () => {
    const response = await request(server)
      .post('/message/')
      .set('token', '12f3')
      .send({ text: messageData.text })
    expect(response.statusCode).toBe(403)
    console.log('oops')
  })

  it('handles post message with incorrect text format', async () => {
    const response = await request(server)
      .post('/message')
      .set('token', userData.token)
      .send({ text: 3214 })
    expect(response.statusCode).toBe(422)
  })

  it('handles correct get message', async () => {
    const response = await request(server)
      .get(`/message/`)
      .set('token', userData.token)
    expect(response.statusCode).toBe(200)
    expect(response.body[0].text).toBe(messageData.text)
  })

  it('handles get message with incorrect user token', async () => {
    const response = await request(server)
      .get('/message/')
      .set('token', '231t4')
    expect(response.statusCode).toBe(403)
  })

  it('handles correct patch message', async () => {
    const response = await request(server)
      .patch(`/message/${messageData.messageId}`)
      .set('token', userData.token)
      .send({ text: messageData.updatedText })
    expect(response.statusCode).toBe(200)
    expect(response.body.text).toBe(messageData.updatedText)
  })

  it('handles patch message with incorrect message id', async () => {
    const response = await request(server)
      .patch('/message/2143drfe9')
      .set('token', userData.token)
      .send({ text: messageData.updatedText })
    expect(response.statusCode).toBe(404)
  })

  it('handles patch message with incorrect user token', async () => {
    const response = await request(server)
      .patch(`/message/${messageData.messageId}`)
      .set('token', '2143e3')
      .send({ text: messageData.updatedText })
    expect(response.statusCode).toBe(403)
  })

  it('handles patch message with incorrect text format', async () => {
    const response = await request(server)
      .patch(`/message/${messageData.messageId}`)
      .set('token', userData.token)
      .send({ text: 121353 })
    expect(response.statusCode).toBe(422)
  })

  it('handles correct delete message', async () => {
    const response = await request(server)
      .delete(`/message/${messageData.messageId}`)
      .set('token', userData.token)
    expect(response.statusCode).toBe(200)
    expect(response.body.text).toBe(messageData.updatedText)
  })

  it('handles delete message with incorrect message id', async () => {
    const response = await request(server)
      .delete('/message/21e5r3')
      .set('token', userData.token)
    expect(response.statusCode).toBe(404)
  })

  it('handles delete message with incorrect user token', async () => {
    const response = await request(server)
      .delete(`/message/${messageData.messageId}`)
      .set('token', 'u1423')
    expect(response.statusCode).toBe(403)
  })
})