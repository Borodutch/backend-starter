import * as Router from 'koa-router'
import * as todoContctoller from '../controllers/todoController'
const router = new Router()

router.get('/todos', todoContctoller.todosGet)

router.get('/todos/:id', todoContctoller.todoGet)

router.post('/todos/add', todoContctoller.todoAdd)

router.delete('/todos/delete/:id', todoContctoller.todoDelete)

router.put('/todos/update/:id', todoContctoller.todoUpdate)

export default router
