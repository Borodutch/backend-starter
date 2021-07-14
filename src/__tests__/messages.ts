const request = require('supertest')
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })
import { app } from '@/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import { Server } from 'http'
import { startKoa, stopServer } from './testUtils'

describe('REST messages with auth', () => {
  let server: Server
  let token = process.env.TOKEN
  let id: string

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('/POST message', async () => {
    const response = await request(server)
      .post('/messages')
      .set('token', token)
      .send({ text: 'Lollipop' })
    id = response.body._id

    expect(response.statusCode).toEqual(200)
  })

  it('/GET message', async () => {
    const response = await request(server)
      .get(`/messages/${id}`)
      .set('token', token)

    expect(response.body.text).toBe('Lollipop')
  })

  it('/PUT message', async () => {
    const response = await request(server)
      .put(`/messages/${id}`)
      .set('token', token)
      .send({ text: 'New Moon' })

    expect(response.body.text).toBe('New Moon')
  })

  it('/DELETE message', async () => {
    const response = await request(server)
      .delete(`/messages/${id}`)
      .set('token', token)

    expect(response.statusCode).toBe(200)
  })
})
