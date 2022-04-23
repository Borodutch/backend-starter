import { IsString } from 'amala'

export default class CreateMessagesInput {
  @IsString()
  text!: string
}
