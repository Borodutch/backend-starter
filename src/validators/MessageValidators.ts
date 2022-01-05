import { IsMongoId, IsNotEmpty, IsString } from 'amala'
import { ObjectId } from 'mongoose'

export class MessageId {
  @IsMongoId()
  id!: ObjectId
}

export class MessageText {
  @IsString()
  @IsNotEmpty()
  text!: string
}
