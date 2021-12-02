import { IsString } from 'amala'

export default class Message {
  @IsString()
  message!: string
}
