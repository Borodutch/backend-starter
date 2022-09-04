import { IsString } from 'amala'

export default class MessageValidatorDelete {
  @IsString()
  _id!: string
}
