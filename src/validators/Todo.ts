import { IsMongoId, IsOptional } from 'class-validator'
import { IsString } from 'amala'

export class ValidatorForBodyAdd {
  @IsString()
  title: string
  @IsString()
  body: string
}

export class ValidatorForId {
  @IsMongoId()
  id: string
}

export class ValidatorForBodyPut {
  @IsOptional()
  @IsString()
  title?: string
  @IsOptional()
  @IsString()
  body?: string
}
