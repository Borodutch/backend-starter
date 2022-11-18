import { IsString } from 'amala'

export default class User {
  @IsString()
  name!: string
  @IsString()
  email?: string
}
