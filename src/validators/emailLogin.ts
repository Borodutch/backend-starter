import { IsEmail, IsString } from 'amala'
export default class {
  @IsEmail()
  email!: string
  @IsString()
  name!: string
}
