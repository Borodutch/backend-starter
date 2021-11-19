import { getModelForClass, prop } from '@typegoose/typegoose'

class Todo {
  @prop({ required: true })
  title: string

  @prop({ required: true })
  body: string
}

const TodoModel = getModelForClass(Todo, {
  schemaOptions: { timestamps: true },
})

export default TodoModel
