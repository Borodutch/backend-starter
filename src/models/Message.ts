import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose'

import { omit } from 'lodash'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Message {
  @prop({ lowercase: true })
  id_user?: string
  @prop({})
  text?: string

  strippedAndFilled(
    this: DocumentType<Message>,
    { withExtra = false }: { withExtra?: boolean } = {}
  ) {
    const stripFields = ['createdAt', 'updatedAt', '__v']
    if (!withExtra) {
      stripFields.push('id_user')
      stripFields.push('text')
    }

    return omit(this.toObject(), stripFields)
  }
}

export const MessageModel = getModelForClass(Message)

export async function createMessage(MessageOptions: {
  id_user?: string
  text?: string
}) {
  const { _id: id } = await MessageModel.create(MessageOptions)

  if (!id) {
    throw new Error('Message not create')
  }
  const message = await MessageModel.findById(id)

  if (!message) {
    throw new Error('Message not found')
  }

  return message
}

export async function getMessage(MessageOptions: {
  id_user?: string
  id?: string
}) {
  const message = await MessageModel.findById(MessageOptions.id)

  if (!message) {
    throw new Error('Message not found')
  }

  if (message.id_user !== MessageOptions.id_user) {
    throw new Error('Аccess error')
  }

  return message
}

export async function updateMessage(MessageOptions: {
  id_user?: string
  id?: string
  text?: string
}) {
  const message = await MessageModel.findById(MessageOptions.id)

  if (!message) {
    throw new Error('Message not found')
  }

  if (message.id_user !== MessageOptions.id_user) {
    throw new Error('Аccess error')
  }

  message.text = MessageOptions.text
  await message.save()

  return message
}

export async function deleteMessage(MessageOptions: {
  id_user?: string
  id?: string
}) {
  const message = await MessageModel.findById(MessageOptions.id)

  if (!message) {
    throw new Error('Message not found')
  }

  if (message.id_user !== MessageOptions.id_user) {
    throw new Error('Аccess error')
  }

  await message.delete()

  return true
}
