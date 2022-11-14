import { IsString } from 'amala'

export default class MessageСreate {
  @IsString()
  token!: string
  @IsString()
  text!: string
}
