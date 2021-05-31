import { Context } from "koa";
import { Controller, Ctx, Delete, Get, Post, Put, Flow } from "amala";
import {
  getMessages,
  getMessageById,
  addMessage,
  updateMessageById,
  deleteMessageById,
} from "@/models/msg";
import { auth } from "@/middleware/auth";

@Flow(auth)
@Controller("/messages")
export default class MessageController {
  @Get("/")
  async getMessages(@Ctx() ctx: Context) {
    return await getMessages(ctx.state.userID);
  }

  @Get("/:id")
  async getMessage(@Ctx() ctx: Context) {
    let id = ctx.params.id;
    return await getMessageById(ctx.state.userID, id);
  }

  @Post("/")
  async createMessage(@Ctx() ctx: Context) {
    return addMessage(ctx.state.userID, ctx.state.text);
  }

  @Put("/")
  async updateMessage(@Ctx() ctx: Context) {
    return updateMessageById(ctx.state.userID, ctx.state.id, ctx.state.text);
  }

  @Delete("/:id")
  async deleteMessage(@Ctx() ctx: Context) {
    let id = ctx.params.id;
    return await deleteMessageById(ctx.state.userID, id);
  }
}
