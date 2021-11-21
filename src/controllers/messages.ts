import {Post, Get, Put, Delete} from 'amala'

@Contoller('/messages')
export default class messagesContoller {
	@Post('/messages')
	@Get('/messages')
	@Get('/messages/:id')
	@Put('/messages/:id')
	@Delete('/messages/:id')
}
