import { IsString } from 'amala'

export default class Message {
  @IsString()
  _id!: string
}
