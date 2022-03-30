import { IsObject } from 'amala'

export default class CreateMessagesInput {
  @IsObject()
  name!: string
  text!: string
}
