import { IsString } from 'amala'

export class IdValid {
  @IsString()
  id!: string
}

export class TextValid {
  @IsString()
  text!: string
}
