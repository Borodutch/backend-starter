import { IsMongoId } from 'class-validator'

export default class MongoId {
  @IsMongoId()
  id!: string
}
