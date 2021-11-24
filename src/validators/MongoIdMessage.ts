import { IsMongoId } from 'class-validator'

export default class MongoIdMessage {
  @IsMongoId()
  id!: string
}
