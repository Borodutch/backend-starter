import { verify } from "@/helpers/jwt";

export default async (ctx: { cookies: { authToken: string } }, next) => {
  try {
    const token: string = ctx.cookies.authToken;
    await verify(token);
    next();
  } catch (error) {
    console.log("Cannot verify user", error);
    // ctx.redirect('/login')
  }
};
