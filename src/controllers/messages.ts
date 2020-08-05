import { Controller, Post, Get, Delete, Put } from "koa-router-ts";
import { Context } from "koa";
import { Message } from "../models/message";

@Controller()
export default class {
  @Get("/messages")
  async get(ctx: Context) {
    try {
      await Message.find().sort({ createdAt: -1 });
      (messages) => {
        ctx.body = messages;
      };
    } catch (err) {
      ctx.body = "error " + err;
    }
  }
  @Get("/messagee", async (ctx: Context) => {
    // const message = new Message(ctx.body);
    // message.save();
    ctx.body = "YES it is WORK!!!!!!";
  })
  @Post("/messages")
  async post(ctx: Context) {
    try {
      const message = new Message();
      message.message = ctx.request.body.message;
      await message.save();
      (data) => (ctx.body = data);
    } catch (err) {
      ctx.body = "error " + err;
    }
  }
  @Delete("/message/:id")
  async delete(ctx: Context) {
    try {
      await Message.deleteOne({ _id: ctx.params.id });
      ctx.body = { status: "Message Deleted!" };
    } catch (err) {
      ctx.body = "error " + err;
    }
  }
  @Put("/update/:id")
  async update(ctx: Context) {
    try {
      await Message.findOneAndUpdate(
        { _id: ctx.params.id },
        { message: ctx.request.body.message }
      );
      ctx.body = { status: "Message Updated!" };
    } catch (err) {
      ctx.body = "error " + err;
    }
  }
}
