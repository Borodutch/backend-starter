import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import TodoModel from '@/models/todo'
import TodoType from '@/validators/TodoType'

@Controller('/todos')
export default class TodosController {
  @Get('/')
  getTodos() {
    return TodoModel.find({})
  }

  @Post('/add')
  async addTodo(@Body({ required: true }) body: TodoType) {
    await new TodoModel(body).save()
  }

  @Delete('/delete/:id')
  async deleteTodo(@Params('id') id) {
    await TodoModel.findByIdAndDelete(id)
  }

  @Put('/update/:id')
  async updateTodo(@Params('id') id, @Body({ required: true }) body) {
    await TodoModel.findByIdAndUpdate(id, body)
  }
}
