import Message from '@/models/Message'

async function message_get(ctx: any) {
  const message = await Message.find()
  await ctx.render('homePage', { messages: message })
}
async function message_post(ctx: any) {
  const message = new Message({
    user: ctx.request.body.username,
    message: ctx.request.body.message,
  })
  console.log(message)
  await message
    .save()
    .then((result: any) => {
      ctx.response.body = result
      ctx.redirect('/')
    })
    .catch((e: any) => {
      console.log(e)
    })
}
async function message_delete(ctx: any) {
  const id = ctx.params.id
  await Message.findByIdAndDelete(id)
  ctx.status = 200
}
async function message_put(ctx: any) {
  const id = ctx.params.id
  await Message.findByIdAndUpdate(id, {
    message: ctx.request.body['message'],
  })
  ctx.status = 200
}
export { message_get, message_post, message_put, message_delete }
