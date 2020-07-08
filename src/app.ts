import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
import 'reflect-metadata'
import * as Koa from 'koa'
import * as json from 'koa-json'
const mongoose = require('mongoose');
import bodyParser from 'koa-bodyparser-ts'
import { loadControllers } from 'koa-router-ts'
import * as cors from '@koa/cors'

const app = new Koa()
const router = loadControllers(`${__dirname}/controllers`, { recurse: true })

const Message = require('./controllers/message')

// Run app
app.use(json());
app.use(cors({ origin: '*' }))
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())



mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(app.listen(1337))
  .then(console.log('Koa application is up and running on port 1337'))
  .catch((err) => console.log(err))
