import { Controller, Get, Post, Delete, Put, Ctx } from "koa-ts-controllers";
import { Context } from "koa";
import { getOrCreateMessage, MessageModel } from "../models/schema";

@Controller("/message")
export default class MessageController {
  @Post("/save")
  async addMessage(@Ctx() ctx: Context) {
    let msg = getOrCreateMessage(ctx.request.body);
    ctx.body = { msg };
  }
  @Get("/read/:id")
  async getMessages(@Ctx() ctx: Context) {
    let msg = await MessageModel.findById(
      {
        _id: ctx.params.id,
      },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log("data:", data);
        }
      }
    );

    ctx.body = { msg };
  }
  @Delete("/del/:id")
  async deleteMessage(@Ctx() ctx: Context) {
    await MessageModel.findByIdAndDelete({
      _id: ctx.params.id,
    });
  }

  @Put("/upd/:id")
  async updateMessage(@Ctx() ctx: Context) {
    ctx.body = await MessageModel.findByIdAndUpdate(
      {
        _id: ctx.params.id,
      },
      {
        $set: {
          title: ctx.request.body.title,
          body: ctx.request.body.body,
        },
        timestamps: true,
      },
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    ).then((data) => {
      return data;
    });
  }
}
