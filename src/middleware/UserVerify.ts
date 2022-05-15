import { Context, Next } from 'koa'
import { findOrCreateUser } from '@/models/User'
import { notFound } from '@hapi/boom'
import { verify } from '@/helpers/jwt'
import ValidUser from '@/validators/User'

export default async function UserVerify(ctx: Context, next: Next) {
  let currentUser = null
  let userId = null
  const token = ctx.header.token as string
  const findNameFromUrl = ctx.request.url.match(
    /\/(\w+)\/(\w+)/
  ) as unknown as string
  try {
    userId = verify(token)['id']
    console.log(userId)
  } catch (error) {
    notFound
  }
  if (userId) {
    currentUser = await findOrCreateUser({
      id: userId,
      name: findNameFromUrl,
    } as ValidUser)
    console.log(currentUser, 'user with token')
  } else {
    if (findNameFromUrl) {
      currentUser = await findOrCreateUser({
        name: findNameFromUrl[2] as ValidUser['name'],
      })
      console.log(currentUser, 'user with NO token')
    }
  }
  ctx.state.user = currentUser
  return next()
  //   const findNameFromUrl = ctx.request.url.match(/\/(\w+)\/(\w+)/)
  //   if (findNameFromUrl) {
  //     currentUser = await findOrCreateUser({
  //       name: findNameFromUrl[2] as ValidUser['name'],
  //     })
  //     // if (currentUser) return next()
  //   }
  //   console.log(ctx)
  //   if (!currentUser && ctx.state.user) {
  //     currentUser = await findOrCreateUser(ctx.state.user as ValidUser)
  //     // if (currentUser) return next()
  //   }
  //   currentUser = await findOrCreateUser({
  //     name: ctx.state.name as ValidUser['name'],
  //   })
  //   ctx.state.user = currentUser
  //   return next()
}
