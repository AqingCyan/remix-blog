import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Button, Input, Textarea } from '@nextui-org/react'
import { Form, useFetcher, useLoaderData, useNavigation } from '@remix-run/react'
import { prisma } from '~/prisma.server'

export async function loader(c: LoaderFunctionArgs) {
  const postId = c.params.postId as string
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    throw new Response('找不到文章', {
      status: 404,
    })
  }

  return json({
    post,
  })
}

export async function action(c: ActionFunctionArgs) {
  const postId = c.params.postId as string
  const formData = await c.request.formData()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const slug = formData.get('slug') as string

  const action = formData.get('action') as 'edit' | 'delete'

  if (action === 'delete') {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    })

    return redirect('/')
  }
  if (!slug) {
    return json({
      success: false,
      errors: {
        slug: 'slug is required',
        title: '',
        content: '',
      },
    })
  }

  if (!title) {
    return json({
      success: false,
      errors: {
        slug: '',
        title: 'title is required',
        content: '',
      },
    })
  }

  if (!content) {
    return json({
      success: false,
      errors: {
        slug: '',
        title: '',
        content: 'content is required',
      },
    })
  }

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      id: slug,
      title,
      content,
    },
  })

  return redirect(`/posts/${slug}`)
}

export default function Page() {
  const loaderData = useLoaderData<typeof loader>()

  const navigation = useNavigation()
  const isDeleting = navigation.state === 'submitting' && navigation.formData?.get('action') === 'delete'
  const isEditing = navigation.state === 'submitting' && navigation.formData?.get('action') === 'edit'

  const deleteFetcher = useFetcher()
  const isDeleting2 = deleteFetcher.state === 'submitting'

  const actionData = useLoaderData<typeof action>()
  const errors = actionData?.errors

  return (
    <div className="p-12">
      <Form method="POST">
        <div className="flex flex-col gap-3">
          <Input
            label="slug"
            name="slug"
            isInvalid={!!errors?.slug}
            errorMessage={errors?.slug}
            defaultValue={loaderData.post.id}
          />
          <Input
            label="标题"
            name="title"
            isInvalid={!!errors?.title}
            errorMessage={errors?.title}
            defaultValue={loaderData.post.title}
          />
          <Textarea
            minRows={10}
            label="正文"
            name="content"
            isInvalid={!!errors?.content}
            errorMessage={errors?.content}
            defaultValue={loaderData.post.content}
          />
          <Button
            name="action"
            type="submit"
            value="edit"
            color="primary"
            isLoading={isEditing}
          >
            更新
          </Button>
          <Button
            name="action"
            value="delete"
            type="submit"
            color="danger"
            isLoading={isDeleting}
          >
            通过在 action 中区分提交动作来做删除
          </Button>
        </div>
      </Form>
      <div className="mt-3">
        <deleteFetcher.Form
          method="POST"
          action={`/posts/${loaderData.post.id}/delete`}
        >
          <Button
            name="action"
            value="delete"
            isLoading={isDeleting2}
            type="submit"
            color="danger"
          >
            通过 useFetcher 实现删除动作
          </Button>
        </deleteFetcher.Form>
      </div>
    </div>
  )
}
