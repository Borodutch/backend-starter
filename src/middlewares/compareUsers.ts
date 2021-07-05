import { User } from '@/models/user'
import { readMessageById } from '@/models/message'
import { Context } from 'koa'

export async function compareUsersMessage(
  ctx: Context,
  id: string,
  user: User
) {
  if (
    (await readMessageById(id))._doc.user._id.toString() ===
    user._doc._id.toString()
  ) {
    return true
  } else {
    ctx.throw(401)
  }
}
