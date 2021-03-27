import {Message} from '../models/message.js'
import jwt_decode from "jwt-decode";
import {verify} from '../helpers/jwt.js'

export const getIndex = async (ctx) => {
    
    await Message.find().sort({createdAt: -1})
        .then(async (result) => {
            await ctx.render('index', {messages: result});
        })
        .catch(err => console.log(err))    
}

export const getAdd = async (ctx) => {
    if (!ctx.cookies.get('jwt')) ctx.redirect('/')
    await ctx.render('add');
}

export const add = async (ctx) => {
    if (ctx.cookies.get('jwt')) {
    const token = ctx.cookies.get('jwt')
    var userDecodedToken = await verify(token)
    const authorName = userDecodedToken['facebookId'] || userDecodedToken['telegramId']
    await Message.create({author: authorName, message: ctx.request.body.message, id: userDecodedToken['id'], name: userDecodedToken['name'] || 'dfdf'})
    ctx.redirect('/')
    }
}

export const deleteMessage = async (ctx) => {

    await Message.findByIdAndDelete(ctx.request.body.id)
        .catch(err => console.log(err))        
}

export const updateMessage = async (ctx) => {

    await Message.findByIdAndUpdate(ctx.request.body.id, {message: ctx.request.body.message})
        .catch(err => console.log(err))
}