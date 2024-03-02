import { Button, Input, Textarea } from '@nextui-org/react'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { prisma } from '~/prisma.server'

export async function action(c: ActionFunctionArgs) {
  const formData = await c.request.formData()

  const slug = formData.get('slug') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string

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

  await prisma.post.create({
    data: {
      id: slug,
      title,
      content,
    },
  })

  return redirect('/')
}

export default function Page() {
  const actionData = useActionData<typeof action>()
  const errors = actionData?.errors

  const navigation = useNavigation()

  return (
    <div>
      <Form method="POST">
        <div className="flex flex-col gap-3 p-12">
          <h1 className="text-xl font-black">发布文章</h1>
          <Input name="slug" isInvalid={!!errors?.slug} errorMessage={errors?.slug} label="slug" />
          <Input name="title" isInvalid={!!errors?.title} errorMessage={errors?.title} label="文章标题" />
          <Textarea name="content" isInvalid={!!errors?.content} errorMessage={errors?.content} label="内容" />
          <Button type="submit" isLoading={navigation.state === 'submitting'} color="primary">
            发布
          </Button>
        </div>
      </Form>
    </div>
  )
}
