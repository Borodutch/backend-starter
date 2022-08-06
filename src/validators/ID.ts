import { IsMongoId } from 'amala'

export default class ID {
  @IsMongoId()
  id!: string
}
