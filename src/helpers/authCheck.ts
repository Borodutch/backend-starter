import { unauthorized, forbidden, notFound } from '@hapi/boom';
import { verify } from '@/helpers/jwt';
import { Context, Next } from 'koa';
import { UserModel } from '@/models/user';

export default async function authCheck (ctx: Context, next: Next) {
    const token = ctx.header.token as string;
    if (!token) {
        throw unauthorized() };
    try {
        verify(token.toString());
        } catch {
        throw forbidden();
        };
    const user = await UserModel.findOne({ token });
    if (!user) {
        throw notFound();
    };
    ctx.state.user = user;
    return next();
};