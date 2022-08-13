import { IsMongoId } from 'amala'

export default class mongoId {
  @IsMongoId()
  id!: string
}
