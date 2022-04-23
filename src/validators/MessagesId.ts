import { IsMongoId } from 'amala'

export default class MessagesId {
  @IsMongoId()
  id!: string
}
