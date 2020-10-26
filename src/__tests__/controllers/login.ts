const request = require('supertest')
import app from '../../app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import runMongo from '../../models/index'

const mongoServer = new MongoMemoryServer()

beforeEach(async () => {
  runMongo(await mongoServer.getUri())
})

test('google login route test', async () => {
  const response = await request(app.callback())
    .post('/login/google')
    .send({ accessToken: 'test' })
  expect(response.body.name).toBe('Alexander Brennenburg')
  expect(response.body.email).toBe('alexanderrennenburg@gmail.com')
})
