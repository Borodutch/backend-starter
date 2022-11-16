import { IsNumber, IsObject, IsString, Type, ValidateNested } from 'amala'

class IdmbRequest {
  @IsNumber()
  rating!: number

  @IsNumber()
  votes!: number

  @IsNumber()
  id!: number
}

class AwardRequest {
  @IsNumber()
  wins!: number

  @IsNumber()
  nominations!: number

  @IsString()
  text!: string
}

class TomatoesRequest {
  @IsNumber()
  rating!: number

  @IsNumber()
  numReviews!: number

  @IsNumber()
  meter!: number
}

export default class MovieRequest {
  @ValidateNested()
  @Type(() => IdmbRequest)
  @IsObject()
  imdb!: IdmbRequest

  @ValidateNested()
  @Type(() => AwardRequest)
  @IsObject()
  awards!: AwardRequest

  @ValidateNested()
  @Type(() => TomatoesRequest)
  @IsObject()
  tomatoes!: TomatoesRequest
}
