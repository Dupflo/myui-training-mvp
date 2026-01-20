'use client'

import { ImageModule as ImageModuleType } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImageModuleProps {
  module: ImageModuleType
  isEditing?: boolean
  onUpdate?: (updates: Partial<ImageModuleType>) => void
}

const widthClasses: Record<string, string> = {
  sm: 'max-w-sm mx-auto',
  md: 'max-w-md mx-auto',
  lg: 'max-w-2xl mx-auto',
  full: 'w-full'
}

export function ImageModule({ module, isEditing, onUpdate }: ImageModuleProps) {
  const { src, alt, caption, width = 'full', rounded = true } = module

  if (!src) {
    return (
      <div 
        className={cn(
          'bg-muted/50 border-2 border-dashed border-muted-foreground/25 flex items-center justify-center',
          widthClasses[width],
          rounded && 'rounded-xl',
          'aspect-video'
        )}
      >
        <div className="text-center text-muted-foreground p-4">
          <svg
            className="mx-auto h-12 w-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">
            {isEditing ? 'Cliquez pour ajouter une image' : 'Image non disponible'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <figure className={cn(widthClasses[width])}>
      <div className={cn('relative overflow-hidden', rounded && 'rounded-xl')}>
        {src.startsWith('http') || src.startsWith('/') ? (
          <img
            src={src}
            alt={alt}
            className={cn(
              'w-full h-auto object-cover',
              'transition-transform duration-300 hover:scale-[1.02]'
            )}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className={cn(
              'w-full h-auto object-cover',
              'transition-transform duration-300 hover:scale-[1.02]'
            )}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
