import { IsString } from 'amala'
import { ObjectId } from 'mongoose'

export default class Message {
  @IsString()
  _id!: ObjectId
  @IsString()
  text!: string
}
