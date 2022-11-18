import { IsString } from 'amala'

export default class newUser {
  @IsString()
  name!: string
  @IsString()
  email?: string
}
