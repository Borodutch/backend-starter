import { IsString } from 'class-validator'

export default class GoogleLogin {
  @IsString()
  accessToken: string
}
