import { IsString } from 'amala'

export default class PutUpdateMessage {
  @IsString()
  content!: string
}
