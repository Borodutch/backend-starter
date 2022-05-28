import { Context, Next } from 'koa';
import { notFound } from '@hapi/boom';
import { MessageModel } from '@/models/message';

export default async function authorCheck (ctx: Context, next: Next) {
    try {
    const id = await MessageModel.findById(ctx.params.id);
    const user = ctx.state.user;
    if (id?.author?.toString() === user.id) {
        ctx.state.message = id;
        return next();
      };
    } catch {
      return ctx.throw(notFound());
    };
};