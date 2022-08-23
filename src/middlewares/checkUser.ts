import { Context, Next } from 'koa'
import { notFound } from '@hapi/boom'
import { UserModel } from '@/models/User'


export default async function (ctx: Context, next: Next) {
    const token = ctx.request.headers.token
    if (!token) return ctx.throw(notFound("User doesn't logged in"))

    const user = await UserModel.findOne({ token })

    if (!user) {
        return ctx.throw(notFound("User doesn't exist"))
    } else {
        ctx.state.user = user
    }
    return next()
}