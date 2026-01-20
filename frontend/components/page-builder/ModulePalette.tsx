'use client'

import { MODULE_TEMPLATES, ModuleType } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import {
  AlertCircle,
  AlignLeft,
  Columns,
  GripVertical,
  Image,
  List,
  Minus,
  MousePointer,
  MoveVertical,
  Type,
  Video,
} from 'lucide-react'

interface ModulePaletteProps {
  onAddModule: (type: ModuleType) => void
}

const iconMap: Record<string, React.ElementType> = {
  Type,
  AlignLeft,
  MousePointer,
  Image,
  Video,
  MoveVertical,
  Minus,
  AlertCircle,
  List,
  Columns,
}

interface DraggablePaletteItemProps {
  type: ModuleType
  label: string
  icon: string
  onAddModule: (type: ModuleType) => void
}

function DraggablePaletteItem({ type, label, icon, onAddModule }: DraggablePaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: 'palette-item',
      moduleType: type,
    },
  })

  const Icon = iconMap[icon] || Type

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
        'text-left text-sm',
        'hover:bg-accent hover:text-accent-foreground',
        'transition-colors duration-200',
        'border border-transparent hover:border-border',
        'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50'
      )}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <button
        className="flex items-center gap-3 flex-1"
        onClick={(e) => {
          e.stopPropagation()
          onAddModule(type)
        }}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
        <span className="font-medium">{label}</span>
      </button>
    </div>
  )
}

export function ModulePalette({ onAddModule }: ModulePaletteProps) {
  return (
    <div className="p-4">
      <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
        Modules
      </h3>
      
      <div className="space-y-1">
        {MODULE_TEMPLATES.map((template) => (
          <DraggablePaletteItem
            key={template.type}
            type={template.type}
            label={template.label}
            icon={template.icon}
            onAddModule={onAddModule}
          />
        ))}
      </div>

      <div className="mt-8 pt-4 border-t">
        <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
          Aide
        </h3>
        <div className="text-xs text-muted-foreground space-y-2">
          <p>• Glissez un module vers le canvas</p>
          <p>• Ou cliquez pour ajouter à la fin</p>
          <p>• Glissez dans une colonne pour y insérer</p>
          <p>• Cliquez sur un module pour le modifier</p>
        </div>
      </div>
    </div>
  )
}
