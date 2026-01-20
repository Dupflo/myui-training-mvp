'use client'

import { CalloutModule as CalloutModuleType } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'

interface CalloutModuleProps {
  module: CalloutModuleType
  isEditing?: boolean
  onUpdate?: (updates: Partial<CalloutModuleType>) => void
}

const variantStyles: Record<string, { bg: string; border: string; text: string }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200'
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-200'
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-200'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200'
  }
}

export function CalloutModule({ module, isEditing, onUpdate }: CalloutModuleProps) {
  const { content, icon = '💡', variant = 'info' } = module
  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl border',
        styles.bg,
        styles.border
      )}
    >
      <span className="text-2xl flex-shrink-0" role="img" aria-label="icon">
        {icon}
      </span>
      <div className={cn('flex-1', styles.text)}>
        {isEditing ? (
          <p
            contentEditable
            suppressContentEditableWarning
            className="outline-none focus:ring-2 focus:ring-primary/50 rounded px-1 -mx-1"
            onBlur={(e) => onUpdate?.({ content: e.currentTarget.textContent || '' })}
          >
            {content}
          </p>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  )
}
