import { IsMongoId } from 'class-validator'
import { IsString } from 'amala'

export class ValidatorForBody {
  @IsString()
  text: string
}

export class ValidatorForId {
  @IsMongoId()
  id: string
}
