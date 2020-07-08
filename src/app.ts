import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
import 'reflect-metadata'
import * as Koa from 'koa'
import * as json from 'koa-json'
const mongoose = require('mongoose');
import bodyParser from 'koa-bodyparser-ts'
import { Context } from 'koa'
import { loadControllers, Controller, Post, Get } from 'koa-router-ts'
import * as cors from '@koa/cors'
import { MessageChannel } from 'worker_threads';

const app = new Koa()
const router = loadControllers(`${__dirname}/controllers`, { recurse: true })

const Message = require('./controllers/message')

//add a new message
router.post('/addMsg', async ctx => {
  try {
    const result = await Message.addMsg({ ...ctx.request.body });
    ctx.body = result;
  } catch (err) {
    ctx.status = 500;
    ctx.body = 'Internal error'
  }
});

//get message by ID
router.get('/message/:id', async ctx => {
  try {
    const result = await Message.getMsg({ id: ctx.params.id });
    ctx.body = result;
  } catch (err) {
    ctx.status = 500;
    ctx.body = 'Internal error'
  }
})

//update message by ID
router.patch('/updateMsg', async ctx => {
  try {
    const result = await Message.updateMsg({ ...ctx.request.body });
    ctx.body = result;
  } catch (err) {
    ctx.status = 500;
    ctx.body = 'Internal error'
  }
})

//delete message by ID
// router.delete('/deleteMsg', async ctx => {
//   try {
//     const result = await Message.deleteMsg({ ...ctx.request.body });
//     ctx.body = result;
//   } catch (err) {
//     ctx.status = 500;
//     ctx.body = 'Internal error'
//   }
// })

//get all messages
// router.get('/', async ctx => {
//   try {
//     const result = await Message.getAllMsg({ id: ctx.params.id });
//     ctx.body = result;
//   } catch (err) {
//     ctx.status = 500;
//     ctx.body = 'Internal error'
//   }
// });

// @Controller('/')
// export default class {
  // @Get('/')
  // async getAll(ctx: Context) {
    // const result = Message.getAllMsg({ id: ctx.params.id })
    // ctx.body = result;
//   }
// }

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
