import { Controller, Body, Post, Get, Delete, Patch, IsString } from 'amala'

import {
	getMessages,
	createMessage,
	deleteMessage,
	updateMessage,
} from '@/models/Message'

@Controller('/message')
export default class Message {
	@IsString()
	@Get('/')
	async get_messages() {
		await getMessages()
	}

	@IsString()
	@Post('/')
	async create_message(@Body('text') text: string) {
		await createMessage(text)
	}

	@IsString()
	@Delete('/')
	async delete_message(@Body('id') id: string) {
		await deleteMessage(id)
	}

	@IsString()
	@Patch('/')
	async update_message(
		@Body('id') id: string,
		@Body('updatedText') updatedText: string
	) {
		await updateMessage(id, updatedText)
	}
}
