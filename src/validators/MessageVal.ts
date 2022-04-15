import { IsMongoId, IsString } from 'amala'

export class MessagesTextValid {
  @IsString()
  text!: string
}

export class MessagesIdValid {
  @IsMongoId()
  mongoId!: string
}
