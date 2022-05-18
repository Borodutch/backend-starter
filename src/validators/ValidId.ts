import { IsString } from 'amala'

export default class IdIsAString {
  @IsString()
  id!: string
}
