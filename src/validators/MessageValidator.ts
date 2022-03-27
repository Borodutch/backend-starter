import { IsMongoId, IsString } from 'amala'

export default class MessageValidator {
  @IsString()
  text!: string
  // @IsMongoId()
  // _id?: string
}
