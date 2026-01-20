import { getLandingPageById } from '@/app/(app)/app/actions/landing-page'
import { getProgramById } from '@/app/(app)/app/actions/program'
import { getCurrentUser } from '@/app/(auth)/actions/auth'
import { PageBuilder } from '@/components/page-builder'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

interface BuilderPageProps {
  params: Promise<{
    id: string
    pageId: string
  }>
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { id: programId, pageId } = await params
  
  // Vérifier l'authentification
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // Récupérer le programme
  const program = await getProgramById(programId)
  if (!program) {
    notFound()
  }

  // Vérifier que l'utilisateur est le créateur
  if (program.creator?.id !== user.id) {
    redirect('/app')
  }

  // Récupérer la landing page
  const landingPage = await getLandingPageById(pageId)
  if (!landingPage) {
    notFound()
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b bg-background flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/app/program/${programId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="border-l h-6" />
          <div>
            <p className="text-sm text-muted-foreground">{program.title}</p>
            <h1 className="font-semibold">{landingPage.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {landingPage._meta?.hasPublishedVersion ? (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Publiée
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Brouillon
            </span>
          )}
          {landingPage.slug && landingPage._meta?.hasPublishedVersion && (
            <Link 
              href={`/${landingPage.slug}`} 
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              /{landingPage.slug}
            </Link>
          )}
        </div>
      </header>

      {/* Page Builder */}
      <main className="flex-1 overflow-hidden">
        <PageBuilder
          initialContent={landingPage.content}
          pageId={landingPage.documentId}
          isPublished={!!landingPage._meta?.hasPublishedVersion}
          meta={landingPage._meta}
        />
      </main>
    </div>
  )
}
