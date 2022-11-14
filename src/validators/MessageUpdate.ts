import { IsString } from 'amala'

export default class MessageGet {
  @IsString()
  token!: string
  @IsString()
  id!: string
  @IsString()
  text!: string
}
