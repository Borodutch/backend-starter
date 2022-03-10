import { Body, Controller, Delete, Get, Params, Post } from 'amala'
import {
  findItem,
  findOrCreateItem,
  removeItem,
  updateItem,
} from '@/models/Item'

@Controller('/item')
export default class ItemController {
  @Post('/')
  async createItem(@Body() body: { text: string }) {
    const item = await findOrCreateItem(body)
    return item
  }

  @Get('/:id')
  async getItem(@Params('id') id: string) {
    const item = await findItem(id)
    return item
  }

  @Post('/:id')
  async updateItem(@Params('id') id: string, @Body() body: { text: string }) {
    const item = await updateItem(id, body)
    return item
  }

  @Delete('/:id')
  async removeItem(@Params('id') id: string) {
    const item = await removeItem(id)
    return item
  }
}
