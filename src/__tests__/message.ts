import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('message test', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let token1: string
  let token2: string
  let messageId: string

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await runMongo(await mongoServer.getUri())
    server = await runApp()

    let response = await request(server)
      .post('/login/email')
      .send({ name: 'Semion', email: 'babaksemion@gmail.com' })

    token1 = response.body.token

    response = await request(server)
      .post('/login/email')
      .send({ name: 'Sempai', email: 'babasempai@gmail.com' })

    token2 = response.body.token
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

  it('creates message for first user', async () => {
    const response = await request(server)
      .post('/message')
      .set('token', token1)
      .send({ text: 'New text' })

    expect(response.status).toBe(200)
    expect(response.body.text).toBe('New text')
    messageId = response.body._id
  })

  it('gets message of first user by second user', async () => {
    const response = await request(server)
      .get('/message/' + messageId)
      .set('token', token2)
      .send()

    expect(response.status).toBe(404)
    expect(response.body.text).toBe(undefined)
  })

  it('puts message of first user by second user', async () => {
    const response = await request(server)
      .put('/message/' + messageId)
      .set('token', token2)
      .send({ text: 'Very new text 2' })

    expect(response.status).toBe(404)
    expect(response.body.text).toBe(undefined)
  })

  it('deletes message of first user by second user', async () => {
    const response = await request(server)
      .delete('/message/' + messageId)
      .set('token', token2)
      .send()

    expect(response.status).toBe(404)
    expect(response.body._id).toBe(undefined)
  })

  it('gets message of first user by first user', async () => {
    const response = await request(server)
      .get('/message/' + messageId)
      .set('token', token1)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.text).toBe('New text')
  })

  it('puts message of first user by first user', async () => {
    const response = await request(server)
      .put('/message/' + messageId)
      .set('token', token1)
      .send({ text: 'Very new text 2' })

    expect(response.status).toBe(200)
    expect(response.body.text).toBe('Very new text 2')
  })

  it('deletes message of first user by first user', async () => {
    const response = await request(server)
      .delete('/message/' + messageId)
      .set('token', token1)
      .send()

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(messageId)
  })
})
