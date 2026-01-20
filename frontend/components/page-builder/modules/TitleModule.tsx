'use client'

import { TitleModule as TitleModuleType, TextAlign, HeadingLevel } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'

interface TitleModuleProps {
  module: TitleModuleType
  isEditing?: boolean
  onUpdate?: (updates: Partial<TitleModuleType>) => void
}

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

const levelClasses: Record<HeadingLevel, string> = {
  h1: 'text-4xl md:text-5xl font-bold tracking-tight',
  h2: 'text-3xl md:text-4xl font-bold tracking-tight',
  h3: 'text-2xl md:text-3xl font-semibold',
  h4: 'text-xl md:text-2xl font-semibold'
}

export function TitleModule({ module, isEditing, onUpdate }: TitleModuleProps) {
  const { content, level, align = 'left', color } = module
  
  const Tag = level as keyof JSX.IntrinsicElements

  if (isEditing) {
    return (
      <div className="group relative">
        <Tag
          className={cn(
            levelClasses[level],
            alignClasses[align],
            'outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1 -mx-2 -my-1',
            'transition-all duration-200'
          )}
          style={{ color }}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ content: e.currentTarget.textContent || '' })}
        >
          {content}
        </Tag>
      </div>
    )
  }

  return (
    <Tag
      className={cn(levelClasses[level], alignClasses[align])}
      style={{ color }}
    >
      {content}
    </Tag>
  )
}
