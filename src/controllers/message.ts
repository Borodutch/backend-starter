import { Body, Controller, Post, CurrentUser, Get, Delete, Flow, State, Patch } from 'amala'
import authCheck from '@/helpers/authCheck'
import { MessageModel, Message } from '@/models/Message'
import authorCheck from '@/helpers/authorCheck'
import MessageBody from '@/validators/MessageBody'
import { User } from '@/models/User'
import { DocumentType } from '@typegoose/typegoose'

@Controller('/message')
@Flow(authCheck)
  export default class MessageController {
        @Post('/')
        addMessage(
          @Body({ required: true }) { text }: MessageBody,
          @CurrentUser() author: User
        ) {
          return MessageModel.create({ author, text })
        }

        @Get('/')
        getMessages(@CurrentUser() author: User) {
          return MessageModel.find({ author })
        }
      
        @Delete('/:id')
        @Flow(authorCheck)
        deleteMessage(@State('message') message: DocumentType<Message>) {
          return message.deleteOne()
        }
      
        @Patch('/:id')
        @Flow(authorCheck)
        updateMessages(
          @Body({ required: true }) { text }: MessageBody,
          @State('message') message: DocumentType<Message>
        ) {
          message.text = text
          return message.save()
        }
   }