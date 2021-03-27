import {getOrCreateUser} from '../models/user.js'
import { verify } from '../helpers/jwt.js'


export const facebookLogin = async (ctx) => {
    const facebookId: string = ctx.request.body.response.authResponse.userID
    const userName: string = ctx.request.body.name
    const user = await getOrCreateUser({facebookId, name: userName})
    ctx.cookies.set('jwt', user.token)
    
}

export const telegramLogin = async (ctx) => {
    const telegramId: string = ctx.request.body.user.id
    const userName: string = ctx.request.body.user.first_name || '' + ' ' + ctx.request.body.user.last_name || ''
    const user = await getOrCreateUser({telegramId, name: userName})
    ctx.cookies.set('jwt', user.token)
    
}

export const checkUser = async (ctx, next) => {
    const token = ctx.cookies.get('jwt');
    if (token){
        try {
            let user = await verify(token)
            ctx.state.user = user
        }
        catch(err) {
            ctx.state.user = null
            console.log(err)
        }
    }
    else {
        ctx.state.user = null
    }

    await next()
}

export const logout = (ctx, next) => {
    ctx.cookies.set('jwt', null)
}

