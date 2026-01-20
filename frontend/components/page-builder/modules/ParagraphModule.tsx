'use client'

import { ParagraphModule as ParagraphModuleType, TextAlign } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'

interface ParagraphModuleProps {
  module: ParagraphModuleType
  isEditing?: boolean
  onUpdate?: (updates: Partial<ParagraphModuleType>) => void
}

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

const fontSizeClasses: Record<string, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

export function ParagraphModule({ module, isEditing, onUpdate }: ParagraphModuleProps) {
  const { content, align = 'left', fontSize = 'base' } = module

  if (isEditing) {
    return (
      <div className="group relative">
        <p
          className={cn(
            fontSizeClasses[fontSize],
            alignClasses[align],
            'text-muted-foreground leading-relaxed',
            'outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1 -mx-2 -my-1',
            'transition-all duration-200 min-h-[1.5em]'
          )}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate?.({ content: e.currentTarget.textContent || '' })}
        >
          {content}
        </p>
      </div>
    )
  }

  return (
    <p className={cn(fontSizeClasses[fontSize], alignClasses[align], 'text-muted-foreground leading-relaxed')}>
      {content}
    </p>
  )
}
