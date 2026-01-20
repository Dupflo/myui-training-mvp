'use client'

import { SpacerModule as SpacerModuleType } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'

interface SpacerModuleProps {
  module: SpacerModuleType
  isEditing?: boolean
}

const heightClasses: Record<string, string> = {
  sm: 'h-4',
  md: 'h-8',
  lg: 'h-16',
  xl: 'h-24'
}

export function SpacerModule({ module, isEditing }: SpacerModuleProps) {
  const { height = 'md' } = module

  if (isEditing) {
    return (
      <div
        className={cn(
          heightClasses[height],
          'bg-muted/30 border border-dashed border-muted-foreground/25 rounded',
          'flex items-center justify-center'
        )}
      >
        <span className="text-xs text-muted-foreground">Espaceur ({height})</span>
      </div>
    )
  }

  return <div className={heightClasses[height]} aria-hidden="true" />
}
