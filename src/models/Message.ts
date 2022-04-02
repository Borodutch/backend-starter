import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
class Message {
  @prop()
  id?: string
  @prop()
  title?: string
  @prop()
  description?: string
}
const msgModel = getModelForClass(Message)
export default msgModel
