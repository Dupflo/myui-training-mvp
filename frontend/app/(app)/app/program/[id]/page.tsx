import { getLandingPagesByProgram } from '@/app/(app)/app/actions/landing-page'
import { getProgramById } from '@/app/(app)/app/actions/program'
import { getCurrentUser } from '@/app/(auth)/actions/auth'
import { Button } from '@/components/ui/button'
import console from 'console'
import { ArrowLeft, ExternalLink, Globe, GlobeLock, Pencil } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CreateLandingPageDialog } from './create-landing-page-dialog'

interface ProgramPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = await params
  
  // Vérifier l'authentification
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // Récupérer le programme
  const program = await getProgramById(id)
  if (!program) {
    notFound()
  }

  console.log(program)

  // Vérifier que l'utilisateur est le créateur
  if (program.creator?.id !== user.id) {
    redirect('/app')
  }

  // Récupérer les landing pages du programme
  const landingPages = await getLandingPagesByProgram(id)

  return (
    <div className="container max-w-5xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/app" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux programmes
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{program.title}</h1>
            {program.description && (
              <p className="text-muted-foreground mt-2">{program.description}</p>
            )}
          </div>
          <CreateLandingPageDialog programId={id} />
        </div>
      </div>

      {/* Liste des landing pages */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Landing Pages</h2>
        
        {landingPages.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Aucune landing page</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre première landing page pour promouvoir ce programme.
              </p>
              <CreateLandingPageDialog programId={id} />
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {landingPages.map((page) => (
              <div
                key={page.documentId}
                className="border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{page.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        page.publishedAt 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {page.publishedAt ? (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Publiée
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <GlobeLock className="h-3 w-3" />
                            Brouillon
                          </span>
                        )}
                      </span>
                    </div>
                    {page.description && (
                      <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      /{page.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {page.publishedAt && (
                      <Link href={`/${page.slug}`} target="_blank">
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/app/program/${id}/builder/${page.documentId}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        Éditer
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
