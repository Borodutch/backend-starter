import {Context} from 'koa'
import {verify} from '@/helpers/jwt'
import {getOrCreateUser} from '@/models/user'

export async function auth(ctx: Context, next) {
    await verify(ctx.headers.token as string).then(async payload => {
        const user = await getOrCreateUser({
            name: payload['name'],
            email: payload['email'],
        })
        ctx.request.body['userID'] = user['_id']
        return next()
    }).catch(() => {
        return ctx.throw(401)
    })
}