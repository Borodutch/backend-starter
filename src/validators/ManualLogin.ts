import { IsString } from 'amala'

export default class ManualLogin {
  @IsString()
  name!: string
}
