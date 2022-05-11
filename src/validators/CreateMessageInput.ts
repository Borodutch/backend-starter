import { IsString } from 'amala'

export default class CreateMessageInput {
  @IsString()
  text!: string
}
