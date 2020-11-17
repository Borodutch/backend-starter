import { Context } from "koa";
import { Controller, Ctx, Post, Flow } from "koa-ts-controllers";
import { verify } from "@/helpers/jwt";

async function checkAuth(ctx: Context): Promise<unknown> {
    // token should be sent in header "Authorization: Bearer <token>"
    const token = (
        ctx.request.headers.Authorization ?? ctx.request.headers.authorization
    ).substring(7); // 'Bearer <token>' -> '<token>'
    return verify(token);
}

@Controller("/protected")
export default class {
    @Post("/veryProtectedRoute")
    @Flow([checkAuth])
    async authRequired(@Ctx() ctx: Context): Promise<Record<string, unknown>> {
        await setTimeout(() => console.log("kek"), 1);
        return {
            success: "ok",
            response: "auth successful",
        };
    }
}

