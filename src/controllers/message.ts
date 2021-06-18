import { MessageModel } from "@/models/message";
import {
  Controller,
  Body,
  Ctx,
  Get,
  Flow,
  Post,
  Put,
  Params,
  Delete,
  CurrentUser,
} from "amala";
import auth from "@/middleware/auth";
import { Context } from "koa";

@Controller("/messages")
@Flow(auth)
export class MessageController {
  @Post("/create")
  async createMessage(
    @Body("body") body: string,
    @Ctx() ctx: Context,
    @CurrentUser() user: any
  ) {
    try {
      const message = await MessageModel.create({ body, author: user._id });
      return message;
    } catch (error) {
      return ctx.throw(500, "Unable to create a message");
    }
  }
  @Get("/")
  async listMessages(@CurrentUser() user: any, @Ctx() ctx: Context) {
    try {
      const messages = await MessageModel.find({ author: user._id });
      return messages;
    } catch (error) {
      return ctx.throw(500, "Unable to display your mesasges");
    }
  }
  @Put("/:id")
  async updateMessage(
    @Params("id") id: string,
    @Body("body") body: string,
    @Ctx() ctx: Context
  ) {
    try {
      const message = await MessageModel.findById(id);
      message.body = body;
      message.save();
      ctx.redirect("/messages");
    } catch (error) {
      return ctx.throw(500, "Unable to update your message");
    }
  }
  @Delete("/:id")
  async deleteMessage(@Params("id") id: string, @Ctx() ctx: Context) {
    try {
      await MessageModel.deleteOne({ _id: id });
      ctx.redirect("/messages");
    } catch (error) {
      return ctx.throw(500, "Unable to delete your message");
    }
  }
}
