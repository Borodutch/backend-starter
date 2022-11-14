import { IsString } from 'amala'

export default class MessageGetOrDelet {
  @IsString()
  token!: string
  @IsString()
  id!: string
}
