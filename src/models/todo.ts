import { Schema, model } from 'mongoose'

interface Todo {
  title: string
  body: string
}

const schema = new Schema<Todo>({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
})

const TodoModel = model<Todo>('Todo', schema)

export default TodoModel
