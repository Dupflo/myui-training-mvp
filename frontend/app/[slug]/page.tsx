import { RenderBlocks } from "@/components/notion/content-block"
import { Button } from "@/components/ui/button"
import { fetchCMS } from "@/utils/fetchers"
import Link from "next/link"
import { notFound } from "next/navigation"

export const revalidate = 60

export default async function NotionPage({
  params,
}: {
  params: { slug: Promise<string> }
}) {
  const { slug } = await params
  const page = await fetchCMS({
    path: `landing-pages/${slug}`,
    tags: [`landing-page:${slug}`],
  })

  if (!page.content) notFound()

  return (
    <section>
      {page.content.info.cover && (
        <div className="flex relative overflow-hidden items-center justify-center h-[30vh] mb-10">
          <h1 className="z-10 relative text-3xl font-bold tracking-tight text-white md:text-5xl">
            {page.content.info.properties.title.title[0].plain_text}
          </h1>
          <img
            src={page.content.info.cover.external.url}
            alt="Cover Image"
            className="mb-5 w-full absolute object-cover top-0 left-0 bottom-0"
          />
        </div>
      )}
      <article className="prose-xl p-4 prose-p:my-2 prose-h3:my-5 prose-li:my-1.5 mx-auto mb-16 flex w-full max-w-4xl flex-col items-start justify-center">
        {!page.content.info.cover && (
          <h1 className="z-10 relative my-20 text-3xl font-bold tracking-tight text-black md:text-5xl">
            {page.content.info.properties.title.title[0].plain_text}
          </h1>
        )}

        <RenderBlocks blocks={page.content.content} />
        <div className="bg-slate-900 fixed w-full flex items-center justify-center bottom-0 left-0 text-white  p-5">
          <Link
            href={`/checkout/${page.program_direct_link.program.documentId}`}
          >
            <Button variant="destructive" size="lg">
              {page.program_direct_link.title}
            </Button>
          </Link>
        </div>
      </article>{" "}
    </section>
  )
}
