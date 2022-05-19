import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('CRUD endpoint', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose

  const emailAccountMock = {
    name: 'Name',
    email: 'name@gmail.com',
    token: '',
    id: '',
  }

  const messageMock = {
    text: 'Bebra',
    id: '',
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

  it('should return user for /login/email request', async () => {
    const response = await request(server)
      .post('/login/email')
      .send(emailAccountMock)
    emailAccountMock.token = response.body.token
    emailAccountMock.id = response.body._id
    expect(response.body.name).toBe(emailAccountMock.name)
    expect(response.body.email).toBe(emailAccountMock.email)
  })

  it('should return posted message for /messages request', async () => {
    const response = await request(server)
      .post('/messages')
      .set('token', emailAccountMock.token)
      .send(messageMock)
    messageMock.id = response.body._id
    expect(response.body.text).toBe(messageMock.text)
  })

  it('should return correct error for incorrect post for /messages request', async () => {
    const response = await request(server)
      .post('/messages')
      .set('token', '1337')
      .send(messageMock)
    expect(response.statusCode).toBe(403)
  })
  it('should return correct error for incorrect post for /messages request', async () => {
    const response = await request(server)
      .post('/messages')
      .set('token', emailAccountMock.token)
      .send({ text: true })
    expect(response.statusCode).toBe(422)
  })

  it('should return one message for /messages request', async () => {
    const response = await request(server)
      .get(`/messages/${messageMock.id}`)
      .set('token', emailAccountMock.token)
    expect(response.body.text).toBe(messageMock.text)
  })

  it('should return correct error for getting one message for /messages request', async () => {
    const response = await request(server)
      .get(`/messages/1337`)
      .set('token', emailAccountMock.token)
    expect(response.statusCode).toBe(400)
  })
  it('should return correct error for getting one message for /messages request', async () => {
    const response = await request(server)
      .get(`/messages/${messageMock.id}`)
      .set('token', '1337')
    expect(response.statusCode).toBe(403)
  })

  it('should return all messages of author for /messages request', async () => {
    const response = await request(server)
      .get('/messages')
      .set('token', emailAccountMock.token)
    expect(response.body[0].text).toBe(messageMock.text)
  })

  it('should return correct error for getting all messages of author for /messages request', async () => {
    const response = await request(server).get('/messages').set('token', '1337')
    expect(response.statusCode).toBe(403)
  })

  it('should return updated message for /messages request', async () => {
    const response = await request(server)
      .patch(`/messages/${messageMock.id}`)
      .set('token', emailAccountMock.token)
      .send({ text: 'Aboba' })
    expect(response.body.text).not.toBe(messageMock.text)
  })

  it('should return correct error for updating message for /messages request', async () => {
    const response = await request(server)
      .patch(`/messages/1337`)
      .set('token', emailAccountMock.token)
      .send({ text: 'Aboba' })
    expect(response.statusCode).toBe(400)
  })
  it('should return correct error for updating message for /messages request', async () => {
    const response = await request(server)
      .patch(`/messages/${messageMock.id}`)
      .set('token', '1337')
      .send({ text: 'Aboba' })
    expect(response.statusCode).toBe(403)
  })
  it('should return correct error for updating message for /messages request', async () => {
    const response = await request(server)
      .patch(`/messages/${messageMock.id}`)
      .set('token', emailAccountMock.token)
      .send({ text: true })
    expect(response.statusCode).toBe(422)
  })

  it('should delete one message for /messages request', async () => {
    const response = await request(server)
      .delete(`/messages/${messageMock.id}`)
      .set('token', emailAccountMock.token)
    expect(response.statusCode).toBe(200)
  })

  it('should return correct error for deleting one message for /messages request', async () => {
    const response = await request(server)
      .delete(`/messages/1337`)
      .set('token', emailAccountMock.token)
    expect(response.statusCode).toBe(400)
  })
  it('should return correct error for deleting one message for /messages request', async () => {
    const response = await request(server)
      .delete(`/messages/${messageMock.id}`)
      .set('token', '1337')
    expect(response.statusCode).toBe(403)
  })
})
