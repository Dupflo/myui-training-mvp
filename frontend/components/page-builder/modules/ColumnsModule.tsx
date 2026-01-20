'use client'

import { useDroppable } from '@dnd-kit/core'
import { ColumnsModule as ColumnsModuleType, ContentModule, getColumnWidthClass, ModuleType } from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'
import { ModuleRenderer } from '../ModuleRenderer'
import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react'

interface ColumnsModuleProps {
  module: ColumnsModuleType
  isEditing?: boolean
  onUpdate?: (updates: Partial<ColumnsModuleType>) => void
  onModuleUpdate?: (columnIndex: number, moduleId: string, updates: Partial<ContentModule>) => void
  onAddModuleToColumn?: (columnIndex: number, moduleType: ModuleType) => void
  onSelectModule?: (moduleId: string) => void
  selectedModuleId?: string | null
  onDeleteModuleFromColumn?: (columnIndex: number, moduleId: string) => void
  onMoveModuleInColumn?: (columnIndex: number, moduleId: string, direction: 'up' | 'down') => void
  onDuplicateModuleInColumn?: (columnIndex: number, moduleId: string) => void
  // Props globales pour gérer les colonnes imbriquées
  globalAddModuleToColumn?: (columnsModuleId: string, columnIndex: number, moduleType: ModuleType) => void
  globalDeleteModuleFromColumn?: (columnsModuleId: string, columnIndex: number, moduleId: string) => void
  globalMoveModuleInColumn?: (columnsModuleId: string, columnIndex: number, moduleId: string, direction: 'up' | 'down') => void
  globalDuplicateModuleInColumn?: (columnsModuleId: string, columnIndex: number, moduleId: string) => void
}

const gapClasses: Record<string, string> = {
  sm: 'gap-2 md:gap-4',
  md: 'gap-4 md:gap-6',
  lg: 'gap-6 md:gap-10'
}

interface DroppableColumnProps {
  moduleId: string
  columnIndex: number
  children: React.ReactNode
  isEmpty: boolean
  isEditing?: boolean
}

function DroppableColumn({ moduleId, columnIndex, children, isEmpty, isEditing }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${moduleId}-${columnIndex}`,
    data: {
      type: 'column',
      moduleId,
      columnIndex,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'space-y-4 min-h-[60px] rounded-lg transition-colors',
        isEditing && 'p-2 -m-2',
        isOver && 'bg-primary/10 ring-2 ring-primary ring-dashed'
      )}
    >
      {children}
      {isEditing && isEmpty && (
        <div className={cn(
          'min-h-[80px] border-2 border-dashed rounded-lg flex items-center justify-center',
          isOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        )}>
          <div className="text-center">
            <Plus className={cn(
              'h-6 w-6 mx-auto mb-1',
              isOver ? 'text-primary' : 'text-muted-foreground'
            )} />
            <p className={cn(
              'text-xs',
              isOver ? 'text-primary font-medium' : 'text-muted-foreground'
            )}>
              {isOver ? 'Déposer ici' : 'Glissez un module'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function ColumnsModule({ 
  module, 
  isEditing, 
  onModuleUpdate, 
  onAddModuleToColumn, 
  onSelectModule, 
  selectedModuleId,
  onDeleteModuleFromColumn,
  onMoveModuleInColumn,
  onDuplicateModuleInColumn,
  globalAddModuleToColumn,
  globalDeleteModuleFromColumn,
  globalMoveModuleInColumn,
  globalDuplicateModuleInColumn
}: ColumnsModuleProps) {
  const { columns, gap = 'md', verticalAlign = 'start' } = module

  const verticalAlignClasses: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  }

  return (
    <div className={cn('flex flex-wrap', gapClasses[gap], verticalAlignClasses[verticalAlign])}>
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={cn(
            getColumnWidthClass(column.width),
            'flex-shrink-0',
            // Ajustement pour le gap
            column.width === '1/2' && 'md:w-[calc(50%-0.75rem)]',
            column.width === '1/3' && 'md:w-[calc(33.333%-1rem)]',
            column.width === '2/3' && 'md:w-[calc(66.666%-0.5rem)]',
            column.width === '1/4' && 'md:w-[calc(25%-1.125rem)]',
            column.width === '3/4' && 'md:w-[calc(75%-0.375rem)]'
          )}
        >
          <DroppableColumn
            moduleId={module.id}
            columnIndex={columnIndex}
            isEmpty={column.modules.length === 0}
            isEditing={isEditing}
          >
            {column.modules.map((mod, modIndex) => (
              <div
                key={mod.id}
                className={cn(
                  'group/nested relative rounded-lg transition-all cursor-pointer',
                  isEditing && 'hover:ring-2 hover:ring-primary/50',
                  selectedModuleId === mod.id && 'ring-2 ring-primary bg-primary/5'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectModule?.(mod.id)
                }}
              >
                {/* Barre d'outils pour les modules dans la colonne */}
                {isEditing && (
                  <div
                    className={cn(
                      'absolute -top-2 right-2 flex items-center gap-0.5 bg-background border rounded-full px-1 py-0.5 shadow-sm z-20',
                      'opacity-0 group-hover/nested:opacity-100 transition-opacity duration-200',
                      selectedModuleId === mod.id && 'opacity-100'
                    )}
                  >
                    {/* Monter */}
                    <button
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveModuleInColumn?.(columnIndex, mod.id, 'up')
                      }}
                      disabled={modIndex === 0}
                      title="Monter"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>

                    {/* Descendre */}
                    <button
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveModuleInColumn?.(columnIndex, mod.id, 'down')
                      }}
                      disabled={modIndex === column.modules.length - 1}
                      title="Descendre"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>

                    {/* Dupliquer */}
                    <button
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDuplicateModuleInColumn?.(columnIndex, mod.id)
                      }}
                      title="Dupliquer"
                    >
                      <Copy className="h-3 w-3" />
                    </button>

                    {/* Supprimer */}
                    <button
                      className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteModuleFromColumn?.(columnIndex, mod.id)
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <ModuleRenderer
                  module={mod}
                  isEditing={isEditing}
                  onUpdate={(updates) => onModuleUpdate?.(columnIndex, mod.id, updates)}
                  onSelectModule={onSelectModule}
                  selectedModuleId={selectedModuleId}
                  // Pour les colonnes imbriquées, on utilise les callbacks globaux
                  onAddModuleToColumn={globalAddModuleToColumn}
                  onDeleteModuleFromColumn={globalDeleteModuleFromColumn}
                  onMoveModuleInColumn={globalMoveModuleInColumn}
                  onDuplicateModuleInColumn={globalDuplicateModuleInColumn}
                />
              </div>
            ))}
          </DroppableColumn>
        </div>
      ))}
    </div>
  )
}
