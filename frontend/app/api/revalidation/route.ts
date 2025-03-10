import { revalidateTag } from "next/cache"

export async function POST(req: Request) {
  const body = await req.json()
  const { entry, model } = body

  switch (model) {
    case 'landing-page':
      revalidateTag(`landing-page:${entry.slug}`)
      revalidateTag(`landing-pages`)
      console.info(`landing-page ${entry.slug} revalidée`)
      break
    case 'program':
      revalidateTag(entry.documentId)
      revalidateTag(`programs`)
      console.info(`program ${entry.title} revalidée`)
      break
    default:
      revalidateTag(model)
      console.info(`${model} revalidé`)
  }

  return new Response('revalidated', {
    status: 200,
  })
}