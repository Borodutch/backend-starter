import { IsMongoId } from 'amala'

export default class MongoId {
  @IsMongoId()
  id!: string
}
