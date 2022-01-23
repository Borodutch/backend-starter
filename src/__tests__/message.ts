import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('message test', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let token: string
  let messageId: string

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

  it('reg user', async () => {
    const response = await request(server)
      .post('/login/email')
      .send({ name: 'Semion', email: 'babaksemion@gmail.com' })

    expect(response.body.token).toBeTruthy()
    expect(response.status).toBe(200)

    token = response.body.token
  })

  it('Create message', async () => {
    const response = await request(server)
      .post('/message')
      .set('token', token)
      .send({ text: 'New text' })

    expect(response.status).toBe(200)
    expect(response.body.text).toBe('New text')
    messageId = response.body._id
  })

  it('Get message', async () => {
    const response = await request(server)
      .get('/message/' + messageId)
      .set('token', token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.text).toBe('New text')
  })

  it('Put message', async () => {
    const response = await request(server)
      .put('/message/' + messageId)
      .set('token', token)
      .send({ text: 'Very new text 2' })

    expect(response.status).toBe(200)
    expect(response.body.text).toBe('Very new text 2')
  })

  it('Del message', async () => {
    const response = await request(server)
      .delete('/message/' + messageId)
      .set('token', token)
      .send()

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(messageId)
  })
})
