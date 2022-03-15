import { IsEmail, IsString } from 'amala'

export default class {
  @IsString()
  name!: string
  @IsEmail()
  email!: string
}
