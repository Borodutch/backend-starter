import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { DocumentType } from '@typegoose/typegoose'
import { Message } from '@/models/messageModel'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { User } from '@/models/User'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import exp = require('constants')

describe('Crud endpoint', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  let author: DocumentType<User>
  let token: string
  let message: DocumentType<Message>

  const user = {
    name: 'Mikita',
    email: 'bebra1488@gmail.com',
  }

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

  it('POST /login/email : return USER with TOKEN', async () => {
    const response = await request(server).post('/login/email').send(user)
    author = response.body
    token = response.body.token
    expect(response.body.email).toBe(user.email)
    expect(response.body.name).toBe(user.name)
  })

  it('POST /message without TOKEN => 401', async () => {
    await request(server).post('/message').send().expect(401)
  })

  it('POST /message : USER with TOKEN => message', async () => {
    const newMessage = { text: 'newMessage' }
    const response = await request(server)
      .post('/message')
      .send(newMessage)
      .set('token', token)
    message = response.body
    expect(message.text).toBe(newMessage.text)
    expect(response.body.author.token).toBe(author.token)
    expect(response.body.author.email).toBe(author.email)
    expect(response.body.author.name).toBe(author.name)
  })

  it('GET /message/:id : return message', async () => {
    const response = await request(server)
      .get(`/message/${message._id}`)
      .send()
      .set('token', token)
    expect(response.body.text).toBe(message.text)
  })

  it('GET /message/:id request with wrong TOKEN => 404', async () => {
    await request(server)
      .get(`/message/${message._id}`)
      .send()
      .set('token', 'not token')
      .expect(403)
  })

  it('PUT /message/:id => changed MESSAGE', async () => {
    const updatedMessage = { text: 'new text' }
    const response = await request(server)
      .put(`/message/${message._id}`)
      .send(updatedMessage)
      .set('token', token)
    expect(response.body.text).toBe(updatedMessage.text)
  })

  it('PUT /message/:id with wrong TOKEN => 404', async () => {
    await request(server)
      .put(`/message/${message._id}`)
      .send()
      .set('token', 'not token')
      .expect(403)
  })

  it('DELETE /message/:id return deleted MESSAGE', async () => {
    const response = await request(server)
      .delete(`/message/${message._id}`)
      .send()
      .set('token', token)
    expect(response.body._id).toBe(message._id)
  })

  it('DELETE /message/:id one more time => 404', async () => {
    await request(server)
      .delete(`/message/${message._id}`)
      .send()
      .set('token', token)
      .expect(404)
  })
})
