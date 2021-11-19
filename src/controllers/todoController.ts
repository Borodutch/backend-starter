import { Body, Controller, Delete, Flow, Get, Params, Post, Put } from 'amala'
import { ValidatorForBody, ValidatorForId } from '@/validators/Todo'
import TodoModel from '@/models/todo'

let path: string

const middlewareRedirect = async (ctx, next) => {
  await next()
  ctx.status = 303
  ctx.redirect(path)
}

@Controller('/')
export default class TodosController {
  @Get('/')
  getTodos() {
    return TodoModel.find({})
  }

  @Get('/:id')
  async getTodo(@Params() params: ValidatorForId) {
    const todo = await TodoModel.findById(params.id)
    return todo
  }

  @Post('/')
  @Flow([middlewareRedirect])
  async addTodo(@Body({ required: true }) body: ValidatorForBody) {
    const todo = await new TodoModel(body).save()
    path = `/${todo._id}`
  }

  @Delete('/:id')
  @Flow([middlewareRedirect])
  async deleteTodo(@Params() params: ValidatorForId) {
    await TodoModel.findByIdAndDelete(params.id)
    path = '/'
  }

  @Put('/:id')
  @Flow([middlewareRedirect])
  async updateTodo(
    @Params() params: ValidatorForId,
    @Body({ required: true }) body: ValidatorForBody
  ) {
    const todo = await TodoModel.findByIdAndUpdate(params.id, body, {
      new: true,
    })
    path = `/${todo._id}`
  }
}
