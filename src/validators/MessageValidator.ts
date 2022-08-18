import { IsString } from 'amala'
import { ObjectId } from 'mongoose'

export default class MessageValidator {
  @IsString()
  message!: string
  @IsString()
  id!: ObjectId
}
