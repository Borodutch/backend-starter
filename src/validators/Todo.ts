import { IsMongoId } from 'class-validator'
import { IsString } from 'amala'

export class ValidatorForBody {
  @IsString()
  title: string
  @IsString()
  body: string
}

export class ValidatorForId {
  @IsMongoId()
  id: string
}
