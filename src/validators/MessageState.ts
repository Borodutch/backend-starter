import { IsNotEmpty } from 'amala'
import { Message } from '@/models/Message'

export default class MessageState {
  @IsNotEmpty()
  message!: Message
}
