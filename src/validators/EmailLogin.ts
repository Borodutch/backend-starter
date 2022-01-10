import { IsNotEmpty, IsString } from 'amala'

export default class EmailLogin {
  @IsString()
  @IsNotEmpty()
  name!: string
  @IsString()
  @IsNotEmpty()
  email!: string
}
