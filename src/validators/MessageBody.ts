import { IsString } from 'amala'

export default class MessageBody {
  @IsString()
  text!: string
}
