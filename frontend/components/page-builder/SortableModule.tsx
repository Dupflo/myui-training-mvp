'use client'

import { ContentModule, ModuleType } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Settings, Trash2 } from 'lucide-react'
import { ModuleRenderer } from './ModuleRenderer'

interface SortableModuleProps {
  module: ContentModule
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onUpdate: (updates: Partial<ContentModule>) => void
  onAddModuleToColumn?: (columnsModuleId: string, columnIndex: number, moduleType: ModuleType) => void
  onSelectModule?: (moduleId: string) => void
  selectedModuleId?: string | null
  onDeleteModuleFromColumn?: (columnsModuleId: string, columnIndex: number, moduleId: string) => void
  onMoveModuleInColumn?: (columnsModuleId: string, columnIndex: number, moduleId: string, direction: 'up' | 'down') => void
  onDuplicateModuleInColumn?: (columnsModuleId: string, columnIndex: number, moduleId: string) => void
}

export function SortableModule({
  module,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate,
  onAddModuleToColumn,
  onSelectModule,
  selectedModuleId,
  onDeleteModuleFromColumn,
  onMoveModuleInColumn,
  onDuplicateModuleInColumn,
}: SortableModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg border bg-background transition-all duration-200',
        isDragging && 'opacity-50 shadow-2xl scale-[1.02]',
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-transparent hover:border-muted-foreground/25'
      )}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Barre d'outils du module */}
      <div
        className={cn(
          'absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background border rounded-full px-2 py-1 shadow-sm z-10',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          isSelected && 'opacity-100'
        )}
      >
        {/* Handle de drag */}
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Type de module */}
        <span className="text-xs text-muted-foreground px-2 border-l border-r">
          {module.type}
        </span>

        {/* Éditer la structure (pour colonnes) */}
        {module.type === 'columns' && (
          <button
            className="p-1 hover:bg-primary/10 rounded text-muted-foreground hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            title="Modifier la structure des colonnes"
          >
            <Settings className="h-4 w-4" />
          </button>
        )}

        {/* Dupliquer */}
        <button
          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
        >
          <Copy className="h-4 w-4" />
        </button>

        {/* Supprimer */}
        <button
          className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Contenu du module */}
      <div className="p-4">
        <ModuleRenderer
          module={module}
          isEditing={true}
          onUpdate={onUpdate}
          onAddModuleToColumn={onAddModuleToColumn}
          onSelectModule={onSelectModule}
          selectedModuleId={selectedModuleId}
          onDeleteModuleFromColumn={onDeleteModuleFromColumn}
          onMoveModuleInColumn={onMoveModuleInColumn}
          onDuplicateModuleInColumn={onDuplicateModuleInColumn}
        />
      </div>
    </div>
  )
}
