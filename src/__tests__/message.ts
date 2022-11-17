import * as request from 'supertest'
import * as shutdown from 'http-graceful-shutdown'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Mongoose } from 'mongoose'
import { Server } from 'http'
import { User, UserModel } from '@/models/User'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'

describe('Testing message controller', () => {
  let server: Server
  let mongoServer: MongoMemoryServer
  let mongoose: Mongoose
  let UserCreate: User
  let token

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    mongoose = await runMongo(await mongoServer.getUri())
    server = await runApp()
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()

    const baseUserTelegramm = {
      telegramId: 121561060,
      token: 'test',
      name: 'Test user Jest',
    }

    UserCreate = await UserModel.create({
      ...baseUserTelegramm,
    })
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

  it('metod message create', async () => {
    const testingMessage = {
      text: 'text for test',
    }
    token = !UserCreate.token ? '' : UserCreate.token
    console.log(UserCreate)
    const response = await request(server)
      .post('/message')
      .set('token', token)
      .set('Accept', 'application/json')
      .send(testingMessage)

    // console.log(response)
    console.log(response.text)
  })
})
