import { PageContent } from '@/lib/types/page-builder'
import { ModuleRenderer } from './ModuleRenderer'

interface PageRendererProps {
  content: PageContent | null
}

export function PageRenderer({ content }: PageRendererProps) {
  if (!content || !content.modules || content.modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        <p>Cette page n'a pas encore de contenu.</p>
      </div>
    )
  }

  // Trier les modules par ordre
  const sortedModules = [...content.modules].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      {sortedModules.map((module) => (
        <ModuleRenderer key={module.id} module={module} isEditing={false} />
      ))}
    </div>
  )
}
