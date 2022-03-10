import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Item {
  @prop()
  text?: string
}

export const ItemModel = getModelForClass(Item)

export async function findOrCreateItem(itemOptions: { text: string }) {
  const option = { upsert: true, new: true }
  const item = await ItemModel.findOneAndUpdate(itemOptions, {}, option)
  if (!item) {
    throw new Error('Item not found')
  }
  return item
}

export async function findItem(id: string) {
  const item = await ItemModel.findById(id)
  if (!item) {
    throw new Error('Item not found')
  }
  return item
}

export async function updateItem(id: string, itemOptions: { text: string }) {
  const item = await ItemModel.findByIdAndUpdate(id, itemOptions)
  if (!item) {
    throw new Error('Item not found')
  }
  return item
}

export async function removeItem(id: string) {
  const item = await ItemModel.findByIdAndDelete(id)
  if (!item) {
    throw new Error('Item not found')
  }
  return item
}
