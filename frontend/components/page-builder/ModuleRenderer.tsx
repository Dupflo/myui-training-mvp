'use client'

import { ContentModule, ColumnsModule as ColumnsModuleType, ModuleType } from '@/lib/types/page-builder'
import {
  TitleModule,
  ParagraphModule,
  ButtonModule,
  ImageModule,
  VideoModule,
  SpacerModule,
  DividerModule,
  CalloutModule,
  ListModule,
  ColumnsModule
} from './modules'

interface ModuleRendererProps {
  module: ContentModule
  isEditing?: boolean
  onUpdate?: (updates: Partial<ContentModule>) => void
  onModuleUpdate?: (columnIndex: number, moduleId: string, updates: Partial<ContentModule>) => void
  onAddModuleToColumn?: (moduleId: string, columnIndex: number, moduleType: ModuleType) => void
  onSelectModule?: (moduleId: string) => void
  selectedModuleId?: string | null
  onDeleteModuleFromColumn?: (moduleId: string, columnIndex: number, nestedModuleId: string) => void
  onMoveModuleInColumn?: (moduleId: string, columnIndex: number, nestedModuleId: string, direction: 'up' | 'down') => void
  onDuplicateModuleInColumn?: (moduleId: string, columnIndex: number, nestedModuleId: string) => void
}

export function ModuleRenderer({ 
  module, 
  isEditing, 
  onUpdate, 
  onModuleUpdate, 
  onAddModuleToColumn, 
  onSelectModule, 
  selectedModuleId,
  onDeleteModuleFromColumn,
  onMoveModuleInColumn,
  onDuplicateModuleInColumn
}: ModuleRendererProps) {
  switch (module.type) {
    case 'title':
      return <TitleModule module={module} isEditing={isEditing} onUpdate={onUpdate} />
    
    case 'paragraph':
      return <ParagraphModule module={module} isEditing={isEditing} onUpdate={onUpdate} />
    
    case 'button':
      return <ButtonModule module={module} isEditing={isEditing} onUpdate={onUpdate} />
    
    case 'image':
      return <ImageModule module={module} isEditing={isEditing} onUpdate={onUpdate} />
    
    case 'video':
      return <VideoModule module={module} isEditing={isEditing} onUpdate={onUpdate} />
    
    case 'spacer':
      return <SpacerModule module={module} isEditing={isEditing} />
    
    case 'divider':
      return <DividerModule module={module} isEditing={isEditing} />
    
    case 'callout':
      return <CalloutModule module={module} isEditing={isEditing} onUpdate={onUpdate} />
    
    case 'list':
      return <ListModule module={module} isEditing={isEditing} onUpdate={onUpdate} />
    
    case 'columns':
      return (
        <ColumnsModule 
          module={module as ColumnsModuleType} 
          isEditing={isEditing} 
          onUpdate={onUpdate}
          onModuleUpdate={onModuleUpdate}
          onAddModuleToColumn={(columnIndex, moduleType) => 
            onAddModuleToColumn?.(module.id, columnIndex, moduleType)
          }
          onSelectModule={onSelectModule}
          selectedModuleId={selectedModuleId}
          onDeleteModuleFromColumn={(columnIndex, nestedModuleId) =>
            onDeleteModuleFromColumn?.(module.id, columnIndex, nestedModuleId)
          }
          onMoveModuleInColumn={(columnIndex, nestedModuleId, direction) =>
            onMoveModuleInColumn?.(module.id, columnIndex, nestedModuleId, direction)
          }
          onDuplicateModuleInColumn={(columnIndex, nestedModuleId) =>
            onDuplicateModuleInColumn?.(module.id, columnIndex, nestedModuleId)
          }
          // Props globales pour les colonnes imbriquées
          globalAddModuleToColumn={onAddModuleToColumn}
          globalDeleteModuleFromColumn={onDeleteModuleFromColumn}
          globalMoveModuleInColumn={onMoveModuleInColumn}
          globalDuplicateModuleInColumn={onDuplicateModuleInColumn}
        />
      )
    
    default:
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          Module non supporté : {(module as ContentModule).type}
        </div>
      )
  }
}
