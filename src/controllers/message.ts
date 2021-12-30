import { Body, Controller, Post, Get, Delete, Params, Header, Res } from 'amala'
import { MessageModel } from '@/models/message'
import { UserModel } from '@/models/user'
import createBoomError from '@/helpers/createBoomError'
import { mongoose } from '@typegoose/typegoose'

@Controller('/messages')
export default class MessageController {
  @Get('/')
  async getAllMessages() {
    const messages = await MessageModel.find()
    return messages
  }

  @Get('/:id')
  async getMessage(@Params('id') id: string) {
    try { 
      if(!mongoose.Types.ObjectId.isValid(id)) throw createBoomError(
        401, 
        "Message id MUST BE ObjectId type", 
        "Use existing message id"
      )

      const message = await MessageModel.findById(id)

      if(!message) throw createBoomError(
        401, 
        "Message with this id doesn't exist", 
        "Use existing message id"
      )

      return message
    }
    catch(err) {
      throw err
    }
  }

  @Post('/')
  async postMessage(
    @Body({ required: true }) { text } : { text: string }, 
    @Header('user_id') user_id : string 
    ) {
      try { 
        if(!mongoose.Types.ObjectId.isValid(user_id)) throw createBoomError(
          401, 
          "User_id MUST BE ObjectId type", 
          "Use existing user id"
        )

        const userExists = await UserModel.exists({ _id: user_id }) 
        if(!userExists) throw createBoomError(
          401, 
          "This user doesn't exist", 
          "Use existing user id"
        )

        const message = await MessageModel.create({ user_id, text })
        return message
      }
      catch(err) {
        throw err
      }
  }

  @Post('/:id')
  async updateMessage(
    @Params('id') id: string, 
    @Header('user_id') user_id : string, 
    @Body({ required: true }) { new_message_text } : { new_message_text : string } 
    ) {
      try { 
        if(!mongoose.Types.ObjectId.isValid(id)) throw createBoomError(
          401, 
          "Message id MUST BE ObjectId type"
        )
        
        const message = await MessageModel.findById(id)

        if(!message) throw createBoomError(
          401, 
          "This message doesn't exist", 
          "Use existing message id"
        )
        if(message?.user_id != user_id) throw createBoomError(
          401, 
          "You have no access to this message", 
          "Users can edit or delete only your own messages"
        )
        if(!new_message_text) throw createBoomError(
          401, 
          "You NEED TO provide a new message text", 
          "Use 'new_message_text' key to provide a new message text"
        )
        
        message.text = new_message_text
        await message.save()
        return message
      }
      catch(err) {
        throw err
      }      
  }
  

  @Delete('/:id')
  async deleteMsg(
    @Params('id') id: string, 
    @Header('user_id') user_id : string
    ) {
      try { 
        if(!mongoose.Types.ObjectId.isValid(id)) throw createBoomError(
          401, 
          "Message id MUST BE ObjectId type",
          "Use existing message id"
        )

        const message = await MessageModel.findById(id)

        if(!message) throw createBoomError(
          401, 
          "This message doesn't exist", 
          "Use existing message id"
        )
        if(message?.user_id != user_id) throw createBoomError(
          401, 
          "You have no access to this message", 
          "Users can edit or delete only your own messages"
        )

        await MessageModel.findByIdAndRemove(id)
        return `You've deleted message ${id}`
      }
      catch(err) {
        throw err
      }
  }
}
