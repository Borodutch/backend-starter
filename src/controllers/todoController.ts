import TodoModel from '../models/todo'

export const todosGet = async (ctx) => {
  await TodoModel.find()
    .then((result) => {
      ctx.body = result
    })
    .catch((err) => {
      console.log(err)
    })
}

export const todoGet = async (ctx) => {
  await TodoModel.findById(ctx.params.id)
    .then((result) => {
      ctx.body = result
    })
    .catch((err) => {
      console.log(err)
    })
}

export const todoAdd = async (ctx) => {
  const todo = new TodoModel(ctx.request.body)
  await todo.save()
  ctx.redirect('/todos')
}

export const todoDelete = async (ctx) => {
  await TodoModel.findByIdAndDelete(ctx.params.id)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .then(() => {
      ctx.status = 303
      ctx.redirect('/todos')
    })
    .catch((err) => {
      console.log(err)
    })
}

export const todoUpdate = async (ctx) => {
  await TodoModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
    new: true,
  })
    .then(() => {
      ctx.status = 303
      ctx.redirect('/todos')
    })
    .catch((err) => {
      console.log(err)
    })
}
