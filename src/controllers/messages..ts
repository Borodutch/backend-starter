import { Context } from 'koa'
import { Controller, Ctx, Post, Get } from 'amala'

@Controller('/')
export default class MessageController {
  @Get('/msg')
  async myEndpointHandler() {
      // GET /api/v1/foo OR /api/v2/foo OR /api/vdangote/foo

      return {myMessage: 'hello one!'};
  }
}



