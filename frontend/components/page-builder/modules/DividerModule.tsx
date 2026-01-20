'use client'

import { DividerModule as DividerModuleType } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'

interface DividerModuleProps {
  module: DividerModuleType
  isEditing?: boolean
}

const styleClasses: Record<string, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted'
}

export function DividerModule({ module }: DividerModuleProps) {
  const { style = 'solid' } = module

  return (
    <hr
      className={cn(
        'border-t border-border my-2',
        styleClasses[style]
      )}
    />
  )
}
