import { IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString } from 'amala'
import { Message } from '@/models/message'

export default class MessageValidator {
  @IsString()
  @IsNotEmpty()
  text: string
  @IsObject()
  @IsOptional()
  message?: Message
  @IsMongoId()
  @IsOptional()
  _id?: string
}
