import { MsgsModel } from "@/models/message";
import { Controller, Ctx, Get, Post, Put, Delete } from "amala";

@Controller("/message")
export default class {
  @Post("/create")
  async create(@Ctx() ctx) {
    const newMsg = new MsgsModel(ctx.request.body);
    await newMsg.save();
  }

  @Get("/read/:id")
  async read(@Ctx() ctx) {
    const someMsg = await MsgsModel.findById(ctx.params.id);
    return someMsg;
  }

  @Put("/update/:id")
  async update(@Ctx() ctx) {
    await MsgsModel.findByIdAndUpdate(ctx.params.id, {
      message: ctx.request.body,
    });
  }

  @Delete("/delete/:id")
  async delete(@Ctx() ctx) {
    await MsgsModel.findByIdAndDelete(ctx.params.id);
  }
}
