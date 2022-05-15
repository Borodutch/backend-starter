import { IsString } from 'amala'

export default class Message {
  @IsString()
  _id!: string
  @IsString()
  text!: string
}
