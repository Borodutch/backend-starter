import { IsOptional, IsString } from 'amala'

export default class ManualLogin {
  @IsString()
  name!: string
  @IsOptional()
  @IsString()
  email?: string
}
