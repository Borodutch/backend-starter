import { IsString } from 'amala'

export default class Login {
  @IsString()
  name!: string

  @IsString()
  email!: string
}
