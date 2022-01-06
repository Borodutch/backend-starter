import { IsMongoId, IsNotEmpty, IsString } from 'amala'

export class MessageId {
  @IsMongoId()
  id!: string
}

export class MessageText {
  @IsString()
  @IsNotEmpty()
  text!: string
}
