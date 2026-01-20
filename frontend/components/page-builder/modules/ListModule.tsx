'use client'

import { ListModule as ListModuleType } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ListModuleProps {
  module: ListModuleType
  isEditing?: boolean
  onUpdate?: (updates: Partial<ListModuleType>) => void
}

export function ListModule({ module, isEditing, onUpdate }: ListModuleProps) {
  const { items, style = 'bullet' } = module

  const ListTag = style === 'number' ? 'ol' : 'ul'

  return (
    <ListTag
      className={cn(
        'space-y-2 pl-0',
        style === 'number' && 'list-decimal list-inside',
        style === 'bullet' && 'list-disc list-inside'
      )}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            'flex items-start gap-2',
            style !== 'number' && 'list-none'
          )}
        >
          {style === 'check' && (
            <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          )}
          {style === 'bullet' && (
            <span className="text-primary flex-shrink-0">•</span>
          )}
          {isEditing ? (
            <span
              contentEditable
              suppressContentEditableWarning
              className="flex-1 outline-none focus:ring-2 focus:ring-primary/50 rounded px-1 -mx-1"
              onBlur={(e) => {
                const newItems = [...items]
                newItems[index] = e.currentTarget.textContent || ''
                onUpdate?.({ items: newItems })
              }}
            >
              {item}
            </span>
          ) : (
            <span className="flex-1">{item}</span>
          )}
        </li>
      ))}
    </ListTag>
  )
}
