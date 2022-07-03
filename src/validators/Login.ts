import { IsString } from 'amala'

export class Login {
  @IsString()
  name!: string

  @IsString()
  email!: string
}

export class Token {
  @IsString()
  token!: string
}
