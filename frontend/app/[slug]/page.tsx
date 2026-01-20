import { getLandingPageBySlug } from '@/app/(app)/app/actions/landing-page'
import { PageRenderer } from '@/components/page-builder'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface LandingPageProps {
  params: Promise<{ slug: string }>
}

// Génération des métadonnées SEO
export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getLandingPageBySlug(slug)

  if (!page) {
    return {
      title: 'Page non trouvée',
    }
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.description,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.description,
      images: page.coverImage?.url ? [page.coverImage.url] : undefined,
    },
  }
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params
  const page = await getLandingPageBySlug(slug)

  // Page non trouvée ou non publiée
  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      {/* Cover Image (optionnel) */}
      {page.coverImage?.url && (
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
          <img
            src={page.coverImage.url}
            alt={page.coverImage.alternativeText || page.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                {page.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Contenu de la page */}
      <article className="container max-w-4xl py-12 px-4">
        {/* Titre si pas de cover image */}
        {!page.coverImage?.url && (
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            {page.title}
          </h1>
        )}

        {/* Rendu des modules */}
        <PageRenderer content={page.content} />

        {/* CTA vers le programme si disponible */}
        {page.program && (
          <div className="mt-16 pt-8 border-t">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Intéressé par ce programme ?
              </p>
              <Link href={`/checkout/${page.program.documentId}`}>
                <Button size="lg">
                  Accéder à la formation
                </Button>
              </Link>
            </div>
          </div>
        )}
      </article>
    </main>
  )
}
