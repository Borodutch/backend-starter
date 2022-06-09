import { IsString, IsObject } from 'amala'

export default class Message {
  _id!: string

  @IsString()
  text!: string

  @IsObject()
  author!: {}
}
