import { Body, Controller, Delete, Get, Params, Post, Put } from 'amala'
import {
  ValidatorForBodyAdd,
  ValidatorForBodyPut,
  ValidatorForId,
} from '@/validators/Todo'
import TodoModel from '@/models/todo'

@Controller('/todos')
export default class TodosController {
  @Get('/')
  getTodos() {
    return TodoModel.find({})
  }

  @Post('/add')
  async addTodo(@Body({ required: true }) body: ValidatorForBodyAdd) {
    return await new TodoModel(body).save()
  }

  @Delete('/delete/:id')
  async deleteTodo(@Params() params: ValidatorForId) {
    return await TodoModel.findByIdAndDelete(params.id)
  }

  @Put('/update/:id')
  async updateTodo(
    @Params() params: ValidatorForId,
    @Body({ required: true }) body: ValidatorForBodyPut
  ) {
    return await TodoModel.findByIdAndUpdate(params.id, body, { new: true })
  }
}
