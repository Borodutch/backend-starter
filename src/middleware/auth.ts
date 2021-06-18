import { verify } from "@/helpers/jwt";
import { Context } from "koa";
import { User, getOrCreateUser } from "@/models/user";

export default async (ctx: Context, next: () => any) => {
  try {
    const token = ctx.cookies.get("authToken");
    const data = (await verify(token)) as User;
    const { name, email, facebookId, telegramId } = data;

    ctx.state.user = await getOrCreateUser({
      name,
      email,
      facebookId,
      telegramId,
    });
    await next();
  } catch (error) {
    return ctx.throw(401, "Unauthorized");
  }
};
