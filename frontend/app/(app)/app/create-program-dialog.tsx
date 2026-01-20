'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Loader2 } from 'lucide-react'
import { createProgram } from '@/app/(app)/app/actions/program'
import { toast } from 'sonner'

export function CreateProgramDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Le titre est requis')
      return
    }

    startTransition(async () => {
      const result = await createProgram({
        title: title.trim(),
        description: description.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
      })

      if (result.success && result.data) {
        toast.success('Programme créé avec succès')
        setIsOpen(false)
        setTitle('')
        setDescription('')
        setPrice('')
        // Rediriger vers la page du programme
        router.push(`/app/program/${result.data.documentId}`)
      } else {
        toast.error(result.error || 'Erreur lors de la création')
      }
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="lg">
        <Plus className="h-5 w-5 mr-2" />
        Créer un programme
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dialog */}
          <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <h2 className="text-2xl font-bold mb-2">Nouveau programme</h2>
            <p className="text-muted-foreground mb-6">
              Créez un programme pour organiser vos formations et landing pages.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du programme *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Formation Marketing Digital"
                  disabled={isPending}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez brièvement votre programme..."
                  disabled={isPending}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix (EUR)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="99.00"
                  disabled={isPending}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Laissez vide si le prix n'est pas encore défini
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isPending} size="lg">
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer le programme
                    </>
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
