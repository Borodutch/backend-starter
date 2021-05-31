import { Context } from 'koa'
import { verify } from '@/helpers/jwt'
import { getOrCreateUser } from '@/models/user'

export async function auth(ctx: Context, next) {
    try {
        const payload = await verify(ctx.headers.token as string)
        const user = await getOrCreateUser({
            name: payload['name'],
            email: payload['email'],
        })
        ctx.state = user
        ctx.request.body['userID'] = user['_id']
        return next()
    } catch (e) {
        return ctx.throw(401)
    }
}
