import { IsMongoId } from 'amala'

export default class MessageId {
  @IsMongoId()
  id!: string
}
