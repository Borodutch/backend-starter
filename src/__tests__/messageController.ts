import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { DocumentType } from '@typegoose/typegoose'
import { Message } from '@/models/Message'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import { User } from '@/models/User'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD Messages endpoint', () => {
  let server: Server
  let mongoServer: MongoMemoryServer

  let author: DocumentType<User>
  let token: string
  let message: DocumentType<Message>

  const userData = {
    email: 'example@gmail.com',
    name: 'Stan',
  }

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await runMongo(mongoServer.getUri())
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
    const response = await request(server).post('/login/email').send(userData)
    author = response.body
    token = response.body.token
    expect(response.body.email).toBe(userData.email)
    expect(response.body.name).toBe(userData.name)
  })

  it('POST /message without TOKEN => 401', async () => {
    await request(server).post('/message').send().expect(401)
  })

  it('POST /message : USER with TOKEN => message', async () => {
    const newMessage = { text: 'new message' }
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

  it('GET /message : return all messages of USER', async () => {
    const response = await request(server)
      .get('/message')
      .send()
      .set('token', token)
    expect(response.body[0].author.id).toBe(author.id)
    expect(response.body[0]._id).toBe(message._id)
  })

  it('GET /message/:id : return MESSAGE', async () => {
    const response = await request(server)
      .get(`/message/${message._id}`)
      .send()
      .set('token', token)
    expect(response.body.text).toBe(message.text)
    expect(response.body.text).toBe(message.text)
  })

  it('GET /message/:id req with wrong TOKEN => 404', async () => {
    await request(server)
      .get(`/message/${message._id}`)
      .send()
      .set('token', 'wrong token')
      .expect(404)
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
      .set('token', 'wrong token')
      .expect(404)
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
