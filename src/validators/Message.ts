import { IsString, IsMongoId } from 'amala'

export default class Message {
  @IsString()
  text!: string
}
