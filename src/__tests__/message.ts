import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Message endpoint', () => {
  let server: Server
  let mongoServer: MongoMemoryServer

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

  // mocks
  const testingEmailMock = {
    name: 'John Doe',
    email: 'john@doe.com',
    token: '',
  }
  const testingMessageMock = {
    text: 'message text',
  }
  let createdMessageId: string
  const testingEditMessageMock = {
    text: 'edited',
  }

  it('create user and save token', async () => {
    const response = await request(server)
      .post('/login/email')
      .send({
        ...testingEmailMock,
      })
    expect(response.body.name).toBe(testingEmailMock.name)
    expect(response.body.email).toBe(testingEmailMock.email)
    testingEmailMock.token = response.body.token
  })
  it('should get empty array of messages from user', async () => {
    const response = await request(server)
      .get('/messages')
      .set('token', testingEmailMock.token)
      .send()
    expect(response.body.length).toBe(0)
    expect(response.body).toStrictEqual([])
  })
  it('should post message from user', async () => {
    const response = await request(server)
      .post('/messages')
      .set('token', testingEmailMock.token)
      .send({ ...testingMessageMock })
    expect(response.body.text).toBe(testingMessageMock.text)
  })
  it('should return array with created message', async () => {
    const response = await request(server)
      .get('/messages')
      .set('token', testingEmailMock.token)
      .send()
    expect(response.body.length).toBe(1)
    expect(response.body[0].text).toBe(testingMessageMock.text)
    createdMessageId = response.body[0]._id
  })
  it('should get message by id', async () => {
    const response = await request(server)
      .get(`/messages/${createdMessageId}`)
      .set('token', testingEmailMock.token)
      .send()
    expect(response.body.text).toBe(testingMessageMock.text)
  })
  it('should edit message', async () => {
    const editResponse = await request(server)
      .post(`/messages/${createdMessageId}`)
      .set('token', testingEmailMock.token)
      .send({ ...testingEditMessageMock })
    expect(editResponse.body.text).toBe(testingEditMessageMock.text)

    const dbResponse = await request(server)
      .get(`/messages/${createdMessageId}`)
      .set('token', testingEmailMock.token)
      .send()
    expect(dbResponse.body.text).toBe(testingEditMessageMock.text)
  })
  it('should delete message', async () => {
    const deleteResponse = await request(server)
      .delete(`/messages/${createdMessageId}`)
      .set('token', testingEmailMock.token)
      .send()
    expect(deleteResponse.body.success).toBe(true)

    const dbResponse = await request(server)
      .get('/messages')
      .set('token', testingEmailMock.token)
      .send()
    expect(dbResponse.body.length).toBe(0)
  })
})
