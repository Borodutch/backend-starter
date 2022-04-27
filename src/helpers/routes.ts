import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import { app } from '@/helpers/runApp'
import Messages from '@/helpers/messageModel'
const router = new Router()

function Routes() {
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
  router.get('/get', async (ctx) => {
    try {
      const messages = await Messages.find()
      ctx.body = messages
    } catch (e) {
      console.log(e)
    }
  })
  router.post('/post', async (ctx) => {
    try {
      const message = await Messages.create({
        message: ctx.request.body.message,
      })
      ctx.body = message
    } catch (e) {
      console.error(e)
    }
  })
}
router.delete('/delete/:id', async (ctx) => {
  try {
    const message = await Messages.findByIdAndDelete(ctx.params.id)
    ctx.body = message
  } catch (e) {
    console.log(e)
  }
})
router.put('/put/:id', async (ctx) => {
  try {
    const id = ctx.params.id
    const message = await Messages.findByIdAndUpdate(id, {
      message: ctx.request.body.message + ' ' + '(ред.)',
    })
    const redMessage = await Messages.findById(id)
    ctx.body = redMessage
  } catch (e) {
    console.log(e)
  }
})
export default Routes
