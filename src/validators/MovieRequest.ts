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

export class MovieTitleRequest {
  @IsString()
  title!: string
}

export default class MovieRequest {
  // @ValidateNested()
  @Type(() => IdmbRequest)
  @IsObject()
  imdb?: IdmbRequest

  // @ValidateNested()
  @Type(() => AwardRequest)
  @IsObject()
  awards?: AwardRequest

  // @ValidateNested()
  @Type(() => TomatoesRequest)
  @IsObject()
  tomatoes?: TomatoesRequest

  @IsString()
  text?: string

  @IsString()
  plot?: string

  @IsString()
  title!: string

  @IsString()
  fullplot?: string

  @IsString()
  released?: string

  @IsString()
  rated?: string

  @IsString()
  lastupdated?: string

  @IsString()
  type?: string

  @IsNumber()
  runtime?: number

  @IsNumber()
  num_mflix_comments?: number

  @IsNumber()
  year?: number

  @IsString()
  _id?: string
}
