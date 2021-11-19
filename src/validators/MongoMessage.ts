import { IsString } from 'amala'

export default class MongoMessage {
  @IsString()
  _id: string
}
