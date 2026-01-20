import { getMyPrograms } from '@/app/(app)/app/actions/program'
import { getCurrentUser } from '@/app/(auth)/actions/auth'
import { ArrowRight, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreateProgramDialog } from './create-program-dialog'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // Vérifier si l'utilisateur est un creator (vous pouvez adapter selon votre logique de rôles)
  const isCreator = user.role?.type === 'creator' || user.role?.name === 'Creator' || true // Pour le MVP, tous les utilisateurs connectés sont creators
  
  const programs = isCreator ? await getMyPrograms() : []

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bienvenue, {user.username || user.email}</h1>
          <p className="text-muted-foreground mt-1">
            {isCreator 
              ? 'Gérez vos programmes et landing pages depuis ce tableau de bord.'
              : 'Accédez à vos formations depuis ce tableau de bord.'}
          </p>
        </div>
        
        {isCreator && <CreateProgramDialog />}
      </div>

      {/* Stats rapides pour creators */}
      {isCreator && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-xl p-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{programs.length}</p>
                <p className="text-sm text-muted-foreground">Programmes</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-xl p-6 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className="text-sm text-muted-foreground">Étudiants</p>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-6 bg-gradient-to-br from-amber-500/5 to-amber-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className="text-sm text-muted-foreground">Revenus</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des programmes */}
      {isCreator && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Mes programmes</h2>
          </div>

          {programs.length === 0 ? (
            <div className="border-2 border-dashed rounded-xl p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Aucun programme</h3>
                <p className="text-muted-foreground mb-6">
                  Créez votre premier programme pour commencer à vendre vos formations en ligne.
                </p>
                <CreateProgramDialog />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <Link
                  key={program.documentId}
                  href={`/app/program/${program.documentId}`}
                  className="group border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-200 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    {program.image?.url ? (
                      <img 
                        src={program.image.url} 
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {program.title}
                    </h3>
                    {program.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {program.description}
                      </p>
                    )}
                    {program.price && (
                      <p className="text-sm font-medium mt-2">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(program.price)}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Gérer</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
