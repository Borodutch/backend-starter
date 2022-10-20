import { IsMongoId } from 'amala'

export default class DocumentId {
  @IsMongoId()
  id!: string
}
