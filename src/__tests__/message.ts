const request = require('supertest')
import axios from 'axios'
import { Server } from 'http'
import MockAdapter from 'axios-mock-adapter'
import { app } from '@/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo, stopMongo } from '@/models/index'
import { dropMongo, startKoa, stopServer } from './testUtils'
import { UserModel } from '@/models/user'

describe('testing CRUD endpoints', () => {
  const axiosMock = new MockAdapter(axios)

  let server: Server

  beforeAll(async () => {
    const mongoServer = new MongoMemoryServer()
    await runMongo(await mongoServer.getUri())
    server = await startKoa(app)
  })

  beforeEach(async () => {
    await dropMongo()
  })

  afterAll(async () => {
    await stopMongo()
    await stopServer(server)
  })

  it('should save users message', async () => {
    const newUser = await UserModel.create(user)
    const message = { body: 'new message' }

    const response = await request(server)
      .post('/message')
      .set({ authorization: user.token })
      .send(message)
      .expect(200)

    const userId: string = String(newUser._id)
    expect(response.body.body).toBe('new message')
    expect(response.body.user).toBe(userId)
  })

  it('should read messages', async () => {
    const newUser = await UserModel.create(user)
    const message = { body: 'new message' }

    const postResponse = await request(server)
      .post('/message')
      .set({ authorization: user.token })
      .send(message)

    const userId: string = String(newUser._id)

    const response = await request(server)
      .get('/message')
      .set({ authorization: user.token })
      .send()
      .expect(200)

    const resp = Object(response.body[0])
    expect(resp.body).toBe(message.body)
    expect(resp.user).toBe(userId)
  })

  it('should update message', async () => {
    const newUser = await UserModel.create(user)
    const message = { body: 'new message' }

    const postResponse = await request(server)
      .post('/message')
      .set({ authorization: user.token })
      .send(message)

    const newMessage = { body: 'updated message' }
    const messageId = String(postResponse.body._id)
    const userId: string = String(newUser._id)

    const putResponse = await request(server)
      .put(`/message/${messageId}`)
      .set({ authorization: user.token })
      .send(newMessage)
      .expect(204)

    const getResponse = await request(server)
      .get('/message')
      .set({ authorization: user.token })
      .send()
      .expect(200)

    const resp = Object(getResponse.body[0])
    expect(resp.body).toBe(newMessage.body)
    expect(resp.user).toBe(userId)
  })

  it('should delete message', async () => {
    const newUser = await UserModel.create(user)
    const message = { body: 'new message' }

    const postResponse = await request(server)
      .post('/message')
      .set({ authorization: user.token })
      .send(message)

    const messageId = String(postResponse.body._id)
    const userId: string = String(newUser._id)

    const response = await request(server)
      .delete(`/message/${messageId}`)
      .set({ authorization: user.token })
      .send(message)
      .expect(204)

    const getResponse = await request(server)
      .get('/message')
      .set({ authorization: user.token })
      .send()
      .expect(200)

    expect(getResponse.body).toStrictEqual([])
  })
})

const user = {
  name: 'nombre',
  email: 'nombre@muchacho.com',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibm9tYnJlIiwiZW1haWwiOiJub21icmVAbXVjaGFjaG8uY29tIiwiaWF0IjoxNjE3ODkzOTkyfQ.kK5rzK40PHhvGgb8u7HjJqeJvUyzZUwfcSJVQYOkMc0',
  _doc: 1,
}
