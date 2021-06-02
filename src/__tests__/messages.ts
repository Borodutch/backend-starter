import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '../models/index'
import { Server } from 'http'
import { dropMongo, startKoa, stopServer, completeUser } from './testUtils'
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../../.env` })
process.env.TESTING = 'true'
import { app } from '../app'
import { MessageModel, Message } from '../models/message'
import { difference } from 'lodash'
const request = require('supertest')

describe('messages API endpoints test', () => {
  let server: Server
  let token: string

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
  })

  beforeEach(async () => {
    await dropMongo()
    const loginResponse = await request(server).post('/login/google').send()
    token = loginResponse.body.token
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('should respond with 401 without token', () => {
    return request(server).get('/messages').send().expect(401)
  })

  it('should post message, store it in DB and return it', async () => {
    const response = await request(server)
      .post('/messages')
      .set('Content-type', 'application/json')
      .set('Token', token)
      .send({ content: 'test message' })
      .expect(200)

    const messageId = response.body.message._id
    const messageInDb = await MessageModel.findById(messageId)

    expect(messageInDb.content).toBe('test message')

    expect(response.body.response).toBe('message posted')
    expect(response.body.message.content).toBe('test message')
  })

  it('should post message, update it with put request and then update it in Db', async () => {
    const responsePost = await request(server)
      .post('/messages')
      .set('Content-type', 'application/json')
      .set('Token', token)
      .send({ content: 'test message' })
      .expect(200)

    const messageId = responsePost.body.message._id
    const oldMessage = await MessageModel.findById(messageId)
    expect(oldMessage.content).toBe('test message')

    const responsePut = await request(server)
      .put('/messages')
      .set('content-type', 'application/json')
      .set('token', token)
      .send({
        _id: messageId,
        content: 'updated test message',
      })
      .expect(200)

    expect(responsePut.body.response).toBe('message updated')
    expect(responsePut.body.message.content).toBe('updated test message')

    const newMessage = await MessageModel.findById(messageId)
    expect(newMessage.content).toBe('updated test message')
  })

  it('should throw 403 on updating of message with wrong id', () => {
    return request(server)
      .put('/messages')
      .set('content-type', 'application/json')
      .set('token', token)
      .send({
        _id: '60b729ded5caa63aa0239198',
        content: 'updated test message',
      })
      .expect(403)
  })

  it('should get 3 posted messages', async () => {
    await Promise.all([
      request(server)
        .post('/messages')
        .set('Content-type', 'application/json')
        .set('Token', token)
        .send({ content: 'test message 1' }),
      request(server)
        .post('/messages')
        .set('Content-type', 'application/json')
        .set('Token', token)
        .send({ content: 'test message 2' }),
      request(server)
        .post('/messages')
        .set('Content-type', 'application/json')
        .set('Token', token)
        .send({ content: 'test message 3' }),
    ])

    const responseGet = await request(server)
      .get('/messages')
      .set('token', token)
      .send()

    const expectedContent = [
      'test message 1',
      'test message 2',
      'test message 3',
    ]
    const receivedContent = responseGet.body.map((item) => item.content)
    expect(difference(expectedContent, receivedContent).length).toBe(0)
  })

  it('should delete posted posted message', async () => {
    const responsePost = await request(server)
      .post('/messages')
      .set('Content-type', 'application/json')
      .set('Token', token)
      .send({ content: 'test message' })

    const messageId = responsePost.body.message._id

    await request(server)
      .delete('/messages')
      .set('Content-type', 'application/json')
      .set('Token', token)
      .send({ _id: messageId })
      .expect(204)

    const messageDb = await MessageModel.findById(messageId)
    expect(messageDb).toBeNull()
  })

  it('should throw 403 on deletion of message with wrong id', () => {
    return request(server)
      .delete('/messages')
      .set('content-type', 'application/json')
      .set('token', token)
      .send({
        _id: '60b729ded5caa63aa0239198',
      })
      .expect(403)
  })
})
