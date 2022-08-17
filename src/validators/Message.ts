import { IsMongoId, IsString } from 'amala'

export default class Message {
  @IsString()
  text!: string
}
