import { IsString } from 'amala'

export default class Message {
  @IsString()
  text!: string
}
