import { IsMongoId } from 'amala'

export default class ObjectIdParam {
  @IsMongoId()
  id!: string
}
