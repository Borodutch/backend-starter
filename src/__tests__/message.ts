import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { DocumentType } from '@typegoose/typegoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import { User } from '@/models/User'
import Message from '@/models/Message'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('messages testing', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let author1: DocumentType<User>
  let author2: DocumentType<User>
  let message1: DocumentType<Message>
  let message2: DocumentType<Message>
  let token1: string
  let token2: string
  const user1 = {
    email: 'john@doe.com',
    name: 'John Doe',
  }
  const user2 = {
    email: 'jane@doe.com',
    name: 'Jane Doe',
  }

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await runMongo(await mongoServer.getUri())
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

  it('POST login/email should return author1 with token', async () => {
    const response = await request(server).post('/login/email').send(user1)
    author1 = response.body
    token1 = response.body.token
    expect(response.body.email).toBe(user1.email)
    expect(response.body.name).toBe(user1.name)
    expect(token1).toBeTruthy()
  })

  it('POST login/email should return author2 with token', async () => {
    const response = await request(server).post('/login/email').send(user2)
    author2 = response.body
    token2 = response.body.token
    expect(response.body.email).toBe(user2.email)
    expect(response.body.name).toBe(user2.name)
    expect(token2).toBeTruthy()
  })

  it('POST /message without a token should return an error', async () => {
    await request(server).post('/message').send().expect(401)
  })

  it('POST /message should return message with author1', async () => {
    const message = { text: 'some text' }
    const response = await request(server)
      .post('/message')
      .send(message)
      .set('token', token1)
    message1 = response.body
    expect(response.body.author.email).toBe(author1.email)
    expect(response.body.author.name).toBe(author1.name)
    expect(response.body.author.token).toBe(author1.token)
    expect(response.body.text).toBe(message.text)
  })

  it('POST /message should return message with author2', async () => {
    const message = { text: 'some text' }
    const response = await request(server)
      .post('/message')
      .send(message)
      .set('token', token2)
    message2 = response.body
    expect(response.body.author.email).toBe(author2.email)
    expect(response.body.author.name).toBe(author2.name)
    expect(response.body.author.token).toBe(author2.token)
    expect(response.body.text).toBe(message.text)
  })

  it('GET /message/:id should return message1 object', async () => {
    const response = await request(server)
      .get(`/message/${message1._id}`)
      .send()
      .set('token', token1)
    expect(response.body.author.id).toBe(author1.id)
    expect(response.body.text).toBe(message1.text)
  })

  it('GET /message/:id should return message2 object', async () => {
    const response = await request(server)
      .get(`/message/${message2._id}`)
      .send()
      .set('token', token2)
    expect(response.body.author.id).toBe(author2.id)
    expect(response.body.text).toBe(message2.text)
  })

  it('GET /message/:id with wrong token should return a notFound error', async () => {
    await request(server)
      .get(`/message/${message2._id}`)
      .send()
      .set('token', token1)
      .expect(404)
  })

  it('GET /message/ should return array with message1 and without message2', async () => {
    const response = await request(server)
      .get('/message')
      .send()
      .set('token', token1)
    expect(response.body[0].author.id).toBe(author1.id)
    expect(response.body[0]._id).toBe(message1._id)
    expect(response.body).toHaveLength(1)
  })

  it('GET /message/ should return array with message1 and without message2', async () => {
    const response = await request(server)
      .get('/message')
      .send()
      .set('token', token1)
    expect(response.body[0].author.id).toBe(author1.id)
    expect(response.body[0]._id).toBe(message1._id)
    expect(response.body).toHaveLength(1)
  })

  it('PUT /message/:id with wrong token should return a notFound error', async () => {
    await request(server)
      .put(`/message/${message1._id}`)
      .send()
      .set('token', token2)
      .expect(404)
  })

  it('PUT /message/:id should return message with changed text', async () => {
    const newMessage = { text: 'new text' }
    const response = await request(server)
      .put(`/message/${message1._id}`)
      .send(newMessage)
      .set('token', token1)
    expect(response.body.text).toBe(newMessage.text)
  })

  it('DELETE /message/:id with wrong token should return a notFound error', async () => {
    await request(server)
      .delete(`/message/${message1._id}`)
      .send()
      .set('token', token2)
      .expect(404)
  })

  it('DELETE /message/:id should return a message as a confirmation of deleting', async () => {
    const response = await request(server)
      .delete(`/message/${message1._id}`)
      .send()
      .set('token', token1)
    expect(response.body._id).toBe(message1._id)
  })

  it('second try to DELETE /message/:id should return a notFound error', async () => {
    await request(server)
      .delete(`/message/${message1._id}`)
      .send()
      .set('token', token1)
      .expect(404)
  })
})
