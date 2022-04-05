import {
  Ref,
  getModelForClass,
  modelOptions,
  post,
  pre,
  prop,
} from '@typegoose/typegoose'
import { User } from '@/models/User'
import { notFound } from '@hapi/boom'
import checkMongoId from '@/helpers/checkMongoId'

@pre<Message>(['findOneAndDelete', 'findOne', 'findOneAndUpdate'], function () {
  checkMongoId(this.getFilter()._id, 'Invalid MongoID')
})
@post<Message>(
  ['findOneAndDelete', 'findOne', 'findOneAndUpdate'],
  (message) => {
    if (!message) {
      throw notFound()
    }
  }
)
@modelOptions({ schemaOptions: { timestamps: true } })
class Message {
  @prop({
    ref: () => User,
    required: true,
  })
  author!: Ref<User>
  @prop({ required: true })
  text!: string
}

const MessageModel = getModelForClass(Message)
export default MessageModel
