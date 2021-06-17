import { MessageModel } from "@/models/message";
import { Controller, Body, Get, Flow, Post, Put, Params, Delete } from "amala";
import auth from "@/middleware/auth";

@Controller("/messages")
@Flow(auth)
export class MessageController {
  @Post("/create")
  async createMessage(@Body("body") body: string) {
    const message = await MessageModel.create({ body });
    return message;
  }
  @Get("/")
  async listMessages() {
    const messages = await MessageModel.find();
    return messages;
  }
  @Put("/:id")
  async updateMessage(@Params("id") id: string, @Body("body") body: string) {
    const message = await MessageModel.findById(id);
    message.body = body;
    message.save();
    return `Message updated to: "${message}"`;
  }
  @Delete("/:id")
  async deleteMessage(@Params("id") id: string) {
    return await MessageModel.deleteOne({ _id: id });
  }
}
