import { getModelForClass, prop } from '@typegoose/typegoose'

class Todo {
  @prop({ required: true })
  public title: string

  @prop({ required: true })
  public body: string
}

const TodoModel = getModelForClass(Todo, {
  schemaOptions: { timestamps: true },
})

export default TodoModel
