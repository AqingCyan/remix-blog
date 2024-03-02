import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { prisma } from '~/prisma.server'

export async function action(c: ActionFunctionArgs) {
  const postId = c.params.postId as string

  await prisma.post.delete({
    where: {
      id: postId,
    },
  })

  return redirect('/')
}
