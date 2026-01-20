'use client'

import { VideoModule as VideoModuleType } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'

interface VideoModuleProps {
  module: VideoModuleType
  isEditing?: boolean
  onUpdate?: (updates: Partial<VideoModuleType>) => void
}

function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null
}

function getVimeoEmbedUrl(url: string): string | null {
  const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/
  const match = url.match(regExp)
  return match ? `https://player.vimeo.com/video/${match[1]}` : null
}

export function VideoModule({ module, isEditing }: VideoModuleProps) {
  const { src, provider = 'youtube', caption } = module

  if (!src) {
    return (
      <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-xl aspect-video flex items-center justify-center">
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">
            {isEditing ? 'Entrez l\'URL de la vidéo' : 'Vidéo non disponible'}
          </p>
        </div>
      </div>
    )
  }

  let embedUrl = src

  if (provider === 'youtube' || src.includes('youtube') || src.includes('youtu.be')) {
    embedUrl = getYouTubeEmbedUrl(src) || src
  } else if (provider === 'vimeo' || src.includes('vimeo')) {
    embedUrl = getVimeoEmbedUrl(src) || src
  }

  return (
    <figure>
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          title={caption || 'Vidéo'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
