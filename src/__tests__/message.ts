import * as dotenv from 'dotenv'
dotenv.config({ path: './.env' })
const request = require('supertest')
import { app } from '@/app'
import { Server } from 'http'
import { startKoa, stopServer } from './testUtils'
import { runMongo, stopMongo } from '@/models/index'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('REST methods', () => {
  let server: Server
  const token = process.env.TOKEN
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

  it('should create a message', async () => {
    const postResponse = await request(server)
      .post('/')
      .set('Authorization', token)
      .send({ text: 'test text' })
    expect(postResponse.statusCode).toEqual(204)
  })

  it('should return an array of messages', async () => {
    const getResponse = await request(server)
      .get('/')
      .set('Authorization', token)
    expect(getResponse.body[0].text).toBe('test text')
    expect(getResponse.body[0].author.name).toBe('earthspacon')

    id = getResponse.body[0]._id
  })

  it('should return a message by id', async () => {
    const idResponse = await request(server)
      .get(`/${id}`)
      .set('Authorization', token)
    expect(idResponse.body.text).toBe('test text')
    expect(idResponse.body.author.name).toBe('earthspacon')
  })

  it('should edit the text', async () => {
    const putResponse = await request(server)
      .put(`/${id}`)
      .set('Authorization', token)
      .send({ text: 'text edited' })
    expect(putResponse.statusCode).toEqual(204)  
  })

  it('should delete a message', async () => {
    const delResponse = await request(server)
      .delete(`/${id}`)
      .set('Authorization', token)
    expect(delResponse.statusCode).toEqual(204)
  })
})
