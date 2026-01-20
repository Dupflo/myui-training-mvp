'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Loader2 } from 'lucide-react'
import { createLandingPage } from '@/app/(app)/app/actions/landing-page'
import { toast } from 'sonner'

interface CreateLandingPageDialogProps {
  programId: string
}

export function CreateLandingPageDialog({ programId }: CreateLandingPageDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Générer le slug automatiquement à partir du titre
  const handleTitleChange = (value: string) => {
    setTitle(value)
    const generatedSlug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(generatedSlug)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !slug.trim()) {
      toast.error('Le titre et le slug sont requis')
      return
    }

    startTransition(async () => {
      const result = await createLandingPage(programId, {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      })

      if (result.success && result.data) {
        toast.success('Landing page créée')
        setIsOpen(false)
        setTitle('')
        setSlug('')
        setDescription('')
        // Rediriger vers le builder
        router.push(`/app/program/${programId}/builder/${result.data.documentId}`)
      } else {
        toast.error(result.error || 'Erreur lors de la création')
      }
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle landing page
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dialog */}
          <div className="relative bg-background rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold mb-4">Nouvelle landing page</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ma super formation"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ma-super-formation"
                    disabled={isPending}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  L'URL de votre page sera : {process.env.NEXT_PUBLIC_APP_URL || 'https://votresite.com'}/{slug || 'slug'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Courte description..."
                  disabled={isPending}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer et éditer'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
