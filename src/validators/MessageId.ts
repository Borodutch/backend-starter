import { IsString } from 'amala'

export default class MessageId {
  @IsString()
  id!: string
}
