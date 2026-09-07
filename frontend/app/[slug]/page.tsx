import { RenderBlocks } from "@/components/notion/content-block"
import { Button } from "@/components/ui/button"
import { fetchCMS } from "@/utils/fetchers"
import Link from "next/link"
import { notFound } from "next/navigation"

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

export default async function NotionPage({
  params,
}: {
  params: { slug: Promise<string> }
}) {
  const { slug } = await params
  const page = await fetchCMS({
    path: `landing-pages/${slug}`,
    tags: [`landing-page:${slug}`],
    revalidate: 1800,
  })

  if (!page.content) notFound()

  const program = page.program
  const price = Number(program?.price)
  const priceLabel = Number.isFinite(price) ? priceFormatter.format(price) : null

  return (
    <section>
      {page.content.info.cover && (
        <div className="flex relative overflow-hidden items-center justify-center h-[30vh] mb-10">
          <h1 className="z-10 relative text-3xl font-bold tracking-tight text-white md:text-5xl">
            {page.content.info.properties.title.title[0].plain_text}
          </h1>
          <img
            src={
              page.content.info.cover.file?.url ||
              page.content.info.cover.external?.url
            }
            alt="Cover Image"
            className="w-full absolute object-cover object-bottom right-0 top-0 m-auto left-0 bottom-0"
          />
        </div>
      )}
      {/* pb-32 : réserve la place de la barre CTA fixe pour qu'elle ne masque
          jamais la fin du contenu */}
      <div className="mx-auto mb-16 w-full max-w-4xl px-4 pb-32">
        {!page.content.info.cover && (
          <h1 className="z-10 relative my-20 text-3xl font-bold tracking-tight text-black md:text-5xl">
            {page.content.info.properties.title.title[0].plain_text}
          </h1>
        )}

        <article className="prose prose-xl max-w-none prose-p:my-4 prose-h3:my-5 prose-li:my-1.5">
          <RenderBlocks blocks={page.content.content} />
        </article>
      </div>

      {program?.documentId && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <p className="hidden font-semibold text-white sm:block">
              {program.title}
            </p>
            <Link
              href={`/checkout/${program.documentId}`}
              className="w-full sm:w-auto"
            >
              {/* couleur explicite : le variant "default" est un bleu nuit,
                  invisible sur le fond sombre de la barre */}
              <Button
                size="lg"
                className="w-full bg-white font-semibold text-slate-900 shadow hover:bg-slate-100"
              >
                Je rejoins {priceLabel ? `— ${priceLabel}` : "la formation"}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
