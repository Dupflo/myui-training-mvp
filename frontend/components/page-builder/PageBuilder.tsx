'use client'

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useCallback, useState, useTransition } from 'react'

import { getLandingPagePublishedVersion, toggleLandingPagePublish, updateLandingPageContent } from '@/app/(app)/app/actions/landing-page'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ColumnsModule,
  ContentModule,
  LandingPageMeta,
  MODULE_TEMPLATES,
  ModuleType,
  PageContent,
  generateModuleId,
  reorderModules,
} from '@/lib/types/page-builder'
import { cn } from '@/lib/utils'
import { Eye, FileCheck, Globe, GlobeLock, Loader2, Plus, Redo2, Save, Undo2 } from 'lucide-react'
import { toast } from 'sonner'
import { ModuleEditor } from './ModuleEditor'
import { ModulePalette } from './ModulePalette'
import { ModuleRenderer } from './ModuleRenderer'
import { SortableModule } from './SortableModule'

// Zone de drop principale pour le canvas
function CanvasDropZone({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
    data: { type: 'canvas' },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[200px] transition-colors rounded-xl',
        isEmpty && isOver && 'bg-primary/5 ring-2 ring-primary ring-dashed'
      )}
    >
      {children}
      {!isEmpty && isOver && (
        <div className="mt-4 p-4 border-2 border-dashed border-primary rounded-lg bg-primary/5 flex items-center justify-center">
          <Plus className="h-5 w-5 text-primary mr-2" />
          <span className="text-sm font-medium text-primary">Déposer ici pour ajouter</span>
        </div>
      )}
    </div>
  )
}

// Preview pendant le drag depuis la palette
function PaletteDragPreview({ moduleType }: { moduleType: ModuleType }) {
  const template = MODULE_TEMPLATES.find(t => t.type === moduleType)
  if (!template) return null

  return (
    <div className="bg-background rounded-lg shadow-2xl p-4 border-2 border-primary min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <span className="text-lg font-bold">{template.label.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-sm">{template.label}</p>
          <p className="text-xs text-muted-foreground">Glissez vers le canvas</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Fonctions helper récursives pour les colonnes
// ============================================

function updateModuleRecursive(
  modules: ContentModule[],
  moduleId: string,
  updates: Partial<ContentModule>
): ContentModule[] {
  return modules.map(mod => {
    if (mod.id === moduleId) {
      return { ...mod, ...updates } as ContentModule
    }
    
    if (mod.type === 'columns') {
      const columnsModule = mod as ColumnsModule
      const updatedColumns = columnsModule.columns.map(column => ({
        ...column,
        modules: updateModuleRecursive(column.modules, moduleId, updates)
      }))
      return { ...columnsModule, columns: updatedColumns } as ContentModule
    }
    
    return mod
  })
}

function addModuleToColumnRecursive(
  modules: ContentModule[],
  columnsModuleId: string,
  columnIndex: number,
  newModule: ContentModule
): ContentModule[] {
  return modules.map(m => {
    if (m.id === columnsModuleId && m.type === 'columns') {
      const columnsModule = m as ColumnsModule
      const newColumns = columnsModule.columns.map((col, idx) => {
        if (idx === columnIndex) {
          return {
            ...col,
            modules: [...col.modules, { ...newModule, order: col.modules.length }]
          }
        }
        return col
      })
      return { ...columnsModule, columns: newColumns }
    }
    
    if (m.type === 'columns') {
      const columnsModule = m as ColumnsModule
      const newColumns = columnsModule.columns.map(col => ({
        ...col,
        modules: addModuleToColumnRecursive(col.modules, columnsModuleId, columnIndex, newModule)
      }))
      return { ...columnsModule, columns: newColumns }
    }
    
    return m
  })
}

function deleteModuleFromColumnRecursive(
  modules: ContentModule[],
  columnsModuleId: string,
  columnIndex: number,
  moduleId: string
): ContentModule[] {
  return modules.map(m => {
    if (m.id === columnsModuleId && m.type === 'columns') {
      const columnsModule = m as ColumnsModule
      const newColumns = columnsModule.columns.map((col, idx) => {
        if (idx === columnIndex) {
          return {
            ...col,
            modules: col.modules.filter(mod => mod.id !== moduleId)
          }
        }
        return col
      })
      return { ...columnsModule, columns: newColumns }
    }
    
    if (m.type === 'columns') {
      const columnsModule = m as ColumnsModule
      const newColumns = columnsModule.columns.map(col => ({
        ...col,
        modules: deleteModuleFromColumnRecursive(col.modules, columnsModuleId, columnIndex, moduleId)
      }))
      return { ...columnsModule, columns: newColumns }
    }
    
    return m
  })
}

function moveModuleInColumnRecursive(
  modules: ContentModule[],
  columnsModuleId: string,
  columnIndex: number,
  moduleId: string,
  direction: 'up' | 'down'
): ContentModule[] {
  return modules.map(m => {
    if (m.id === columnsModuleId && m.type === 'columns') {
      const columnsModule = m as ColumnsModule
      const newColumns = columnsModule.columns.map((col, idx) => {
        if (idx === columnIndex) {
          const modIndex = col.modules.findIndex(mod => mod.id === moduleId)
          if (modIndex === -1) return col
          
          const newIndex = direction === 'up' ? modIndex - 1 : modIndex + 1
          if (newIndex < 0 || newIndex >= col.modules.length) return col
          
          const reorderedModules = [...col.modules]
          const [removed] = reorderedModules.splice(modIndex, 1)
          reorderedModules.splice(newIndex, 0, removed)
          
          return {
            ...col,
            modules: reorderedModules.map((mod, i) => ({ ...mod, order: i }))
          }
        }
        return col
      })
      return { ...columnsModule, columns: newColumns }
    }
    
    if (m.type === 'columns') {
      const columnsModule = m as ColumnsModule
      const newColumns = columnsModule.columns.map(col => ({
        ...col,
        modules: moveModuleInColumnRecursive(col.modules, columnsModuleId, columnIndex, moduleId, direction)
      }))
      return { ...columnsModule, columns: newColumns }
    }
    
    return m
  })
}

function duplicateModuleInColumnRecursive(
  modules: ContentModule[],
  columnsModuleId: string,
  columnIndex: number,
  moduleId: string
): ContentModule[] {
  return modules.map(m => {
    if (m.id === columnsModuleId && m.type === 'columns') {
      const columnsModule = m as ColumnsModule
      const newColumns = columnsModule.columns.map((col, idx) => {
        if (idx === columnIndex) {
          const modIndex = col.modules.findIndex(mod => mod.id === moduleId)
          if (modIndex === -1) return col
          
          const existingModule = col.modules[modIndex]
          const duplicatedModule = {
            ...existingModule,
            id: generateModuleId(existingModule.type),
            order: modIndex + 1,
          }
          
          const newModulesList = [
            ...col.modules.slice(0, modIndex + 1),
            duplicatedModule,
            ...col.modules.slice(modIndex + 1),
          ].map((mod, i) => ({ ...mod, order: i }))
          
          return { ...col, modules: newModulesList }
        }
        return col
      })
      return { ...columnsModule, columns: newColumns }
    }
    
    if (m.type === 'columns') {
      const columnsModule = m as ColumnsModule
      const newColumns = columnsModule.columns.map(col => ({
        ...col,
        modules: duplicateModuleInColumnRecursive(col.modules, columnsModuleId, columnIndex, moduleId)
      }))
      return { ...columnsModule, columns: newColumns }
    }
    
    return m
  })
}

// ============================================
// Composant PageBuilder
// ============================================

interface PageBuilderProps {
  initialContent: PageContent | null
  pageId: string
  isPublished: boolean
  meta?: LandingPageMeta
}

export function PageBuilder({ initialContent, pageId, isPublished: initialIsPublished, meta }: PageBuilderProps) {
  const [content, setContent] = useState<PageContent>(
    initialContent || { modules: [], version: 1 }
  )
  const [activeModule, setActiveModule] = useState<ContentModule | null>(null)
  const [activePaletteType, setActivePaletteType] = useState<ModuleType | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [history, setHistory] = useState<PageContent[]>([content])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isPublished, setIsPublished] = useState(initialIsPublished)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showPublishedPreview, setShowPublishedPreview] = useState(false)
  const [publishedContent, setPublishedContent] = useState<PageContent | null>(null)
  const [isLoadingPublished, setIsLoadingPublished] = useState(false)

  // Info sur les versions
  const hasPublishedVersion = meta?.hasPublishedVersion ?? false
  const hasNewerDraft = meta?.hasNewerDraft ?? false

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Historique pour undo/redo
  const pushToHistory = useCallback((newContent: PageContent) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      return [...newHistory, newContent]
    })
    setHistoryIndex(prev => prev + 1)
    setHasUnsavedChanges(true)
  }, [historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setContent(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setContent(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  // Gestion du drag & drop
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    // Si c'est un élément de la palette
    if (String(active.id).startsWith('palette-')) {
      const moduleType = active.data.current?.moduleType as ModuleType
      setActivePaletteType(moduleType)
      setActiveModule(null)
      return
    }
    // Sinon c'est un module existant
    setActivePaletteType(null)
    const draggedModule = content.modules.find(m => m.id === active.id)
    setActiveModule(draggedModule || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveModule(null)
      setActivePaletteType(null)
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)

    // Cas 1: Drop depuis la palette vers une colonne
    if (activeId.startsWith('palette-') && overId.startsWith('column-')) {
      const moduleType = active.data.current?.moduleType as ModuleType
      const { moduleId, columnIndex } = over.data.current as { moduleId: string; columnIndex: number }
      
      // Vérifier si on essaie d'ajouter des colonnes dans des colonnes imbriquées
      if (moduleType === 'columns') {
        // Vérifier si le module columns parent est au niveau racine
        const isParentAtRoot = content.modules.some(m => m.id === moduleId)
        if (!isParentAtRoot) {
          toast.error('Les colonnes ne peuvent être imbriquées qu\'une seule fois')
          setActiveModule(null)
          setActivePaletteType(null)
          return
        }
      }
      
      if (moduleType && moduleId !== undefined && columnIndex !== undefined) {
        addModuleToColumn(moduleId, columnIndex, moduleType)
      }
      setActiveModule(null)
      setActivePaletteType(null)
      return
    }

    // Cas 2: Drop depuis la palette vers le canvas principal (zone vide)
    if (activeId.startsWith('palette-') && overId === 'canvas-drop-zone') {
      const moduleType = active.data.current?.moduleType as ModuleType
      if (moduleType) {
        addModule(moduleType)
      }
      setActiveModule(null)
      setActivePaletteType(null)
      return
    }

    // Cas 3: Drop depuis la palette vers un module existant (insertion)
    if (activeId.startsWith('palette-')) {
      const moduleType = active.data.current?.moduleType as ModuleType
      const targetIndex = content.modules.findIndex(m => m.id === overId)
      
      if (moduleType && targetIndex !== -1) {
        insertModuleAtIndex(moduleType, targetIndex)
      }
      setActiveModule(null)
      setActivePaletteType(null)
      return
    }

    // Cas 4: Réorganisation des modules existants
    if (over && active.id !== over.id) {
      const oldIndex = content.modules.findIndex(m => m.id === active.id)
      const newIndex = content.modules.findIndex(m => m.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newModules = reorderModules(arrayMove(content.modules, oldIndex, newIndex))
        const newContent = { ...content, modules: newModules }
        
        setContent(newContent)
        pushToHistory(newContent)
      }
    }

    setActiveModule(null)
    setActivePaletteType(null)
  }

  // Ajouter un module à une colonne
  const addModuleToColumn = useCallback((columnsModuleId: string, columnIndex: number, moduleType: ModuleType) => {
    // Vérifier si on essaie d'ajouter des colonnes dans des colonnes imbriquées
    if (moduleType === 'columns') {
      // Vérifier si le module columns parent est au niveau racine
      const isParentAtRoot = content.modules.some(m => m.id === columnsModuleId)
      if (!isParentAtRoot) {
        toast.error('Les colonnes ne peuvent être imbriquées qu\'une seule fois')
        return
      }
    }
    
    const template = MODULE_TEMPLATES.find(t => t.type === moduleType)
    if (!template) return

    const newModule: ContentModule = {
      id: generateModuleId(moduleType),
      type: moduleType,
      order: 0,
      ...template.defaultProps,
    } as ContentModule

    const newModules = addModuleToColumnRecursive(content.modules, columnsModuleId, columnIndex, newModule)

    const newContent: PageContent = { ...content, modules: newModules }
    setContent(newContent)
    pushToHistory(newContent)
  }, [content, pushToHistory])

  // Ajouter un module depuis la palette (à la fin)
  const addModule = useCallback((type: ModuleType) => {
    const template = MODULE_TEMPLATES.find(t => t.type === type)
    if (!template) return

    const newModule: ContentModule = {
      id: generateModuleId(type),
      type,
      order: content.modules.length,
      ...template.defaultProps,
    } as ContentModule

    const newContent = {
      ...content,
      modules: [...content.modules, newModule],
    }

    setContent(newContent)
    pushToHistory(newContent)
    setSelectedModuleId(newModule.id)
  }, [content, pushToHistory])

  // Insérer un module à une position spécifique
  const insertModuleAtIndex = useCallback((type: ModuleType, index: number) => {
    const template = MODULE_TEMPLATES.find(t => t.type === type)
    if (!template) return

    const newModule: ContentModule = {
      id: generateModuleId(type),
      type,
      order: index,
      ...template.defaultProps,
    } as ContentModule

    // Insérer le nouveau module à l'index et réordonner
    const newModules = [
      ...content.modules.slice(0, index),
      newModule,
      ...content.modules.slice(index),
    ]

    const newContent = {
      ...content,
      modules: reorderModules(newModules),
    }

    setContent(newContent)
    pushToHistory(newContent)
    setSelectedModuleId(newModule.id)
  }, [content, pushToHistory])

  // Mettre à jour un module (y compris dans les colonnes)
  const updateModule = useCallback((moduleId: string, updates: Partial<ContentModule>) => {
    const newModules = updateModuleRecursive(content.modules, moduleId, updates)
    const newContent: PageContent = { ...content, modules: newModules }
    setContent(newContent)
    pushToHistory(newContent)
  }, [content, pushToHistory])

  // Supprimer un module
  const deleteModule = useCallback((moduleId: string) => {
    const newModules = reorderModules(
      content.modules.filter(m => m.id !== moduleId)
    )
    const newContent = { ...content, modules: newModules }
    
    setContent(newContent)
    pushToHistory(newContent)
    setSelectedModuleId(null)
  }, [content, pushToHistory])

  // Dupliquer un module
  const duplicateModule = useCallback((moduleId: string) => {
    const moduleIndex = content.modules.findIndex(m => m.id === moduleId)
    if (moduleIndex === -1) return

    const existingModule = content.modules[moduleIndex]
    const newModule = {
      ...existingModule,
      id: generateModuleId(existingModule.type),
      order: existingModule.order + 1,
    }

    const newModules = [
      ...content.modules.slice(0, moduleIndex + 1),
      newModule,
      ...content.modules.slice(moduleIndex + 1),
    ]

    const newContent = { ...content, modules: reorderModules(newModules) }
    setContent(newContent)
    pushToHistory(newContent)
  }, [content, pushToHistory])

  // Supprimer un module dans une colonne
  const deleteModuleFromColumn = useCallback((columnsModuleId: string, columnIndex: number, moduleId: string) => {
    const newModules = deleteModuleFromColumnRecursive(content.modules, columnsModuleId, columnIndex, moduleId)
    const newContent: PageContent = { ...content, modules: newModules }
    setContent(newContent)
    pushToHistory(newContent)
    setSelectedModuleId(null)
  }, [content, pushToHistory])

  // Déplacer un module dans une colonne (haut/bas)
  const moveModuleInColumn = useCallback((columnsModuleId: string, columnIndex: number, moduleId: string, direction: 'up' | 'down') => {
    const newModules = moveModuleInColumnRecursive(content.modules, columnsModuleId, columnIndex, moduleId, direction)
    const newContent: PageContent = { ...content, modules: newModules }
    setContent(newContent)
    pushToHistory(newContent)
  }, [content, pushToHistory])

  // Dupliquer un module dans une colonne
  const duplicateModuleInColumn = useCallback((columnsModuleId: string, columnIndex: number, moduleId: string) => {
    const newModules = duplicateModuleInColumnRecursive(content.modules, columnsModuleId, columnIndex, moduleId)
    const newContent: PageContent = { ...content, modules: newModules }
    setContent(newContent)
    pushToHistory(newContent)
  }, [content, pushToHistory])

  // Sauvegarder vers Strapi (draft)
  const handleSave = useCallback(() => {
    startTransition(async () => {
      const result = await updateLandingPageContent(pageId, {
        ...content,
        updatedAt: new Date().toISOString(),
      })

      if (result.success) {
        toast.success('Brouillon sauvegardé')
        setHasUnsavedChanges(false)
      } else {
        toast.error(result.error || 'Erreur lors de la sauvegarde')
      }
    })
  }, [content, pageId])

  // Publier/Dépublier
  const handleTogglePublish = useCallback(() => {
    startTransition(async () => {
      // Si des changements non sauvegardés, sauvegarder d'abord
      if (hasUnsavedChanges) {
        const saveResult = await updateLandingPageContent(pageId, {
          ...content,
          updatedAt: new Date().toISOString(),
        })
        if (!saveResult.success) {
          toast.error(saveResult.error || 'Erreur lors de la sauvegarde')
          return
        }
      }

      const result = await toggleLandingPagePublish(pageId)

      if (result.success) {
        setIsPublished(result.published)
        setHasUnsavedChanges(false)
        toast.success(result.published ? 'Page publiée' : 'Page dépubliée')
      } else {
        toast.error(result.error || 'Erreur lors de la publication')
      }
    })
  }, [content, pageId, hasUnsavedChanges])

  // Voir la version publiée
  const handleViewPublished = useCallback(async () => {
    setIsLoadingPublished(true)
    try {
      const published = await getLandingPagePublishedVersion(pageId)
      if (published?.content) {
        setPublishedContent(published.content)
        setShowPublishedPreview(true)
      } else {
        toast.error('Impossible de charger la version publiée')
      }
    } catch {
      toast.error('Erreur lors du chargement')
    } finally {
      setIsLoadingPublished(false)
    }
  }, [pageId])

  // Fonction pour trouver un module par ID (y compris dans les colonnes)
  const findModuleById = useCallback((moduleId: string | null): ContentModule | null => {
    if (!moduleId) return null
    
    // Fonction récursive pour chercher dans les modules
    const searchInModules = (modules: ContentModule[]): ContentModule | null => {
      for (const mod of modules) {
        if (mod.id === moduleId) return mod
        
        // Chercher récursivement dans les colonnes
        if (mod.type === 'columns') {
          const columnsModule = mod as ColumnsModule
          for (const column of columnsModule.columns) {
            const found = searchInModules(column.modules)
            if (found) return found
          }
        }
      }
      return null
    }
    
    return searchInModules(content.modules)
  }, [content.modules])

  const selectedModule = findModuleById(selectedModuleId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar gauche - Palette de modules */}
        <div className="w-64 border-r bg-muted/30 overflow-y-auto flex-shrink-0">
          <ModulePalette onAddModule={addModule} />
        </div>

        {/* Zone centrale - Canvas */}
        <div className="flex-1 overflow-y-auto bg-background">
          {/* Toolbar */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={historyIndex === 0}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={historyIndex === history.length - 1}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {hasNewerDraft && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                Brouillon plus récent que la version publiée
              </span>
            )}
            {hasUnsavedChanges && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Modifications non sauvegardées
              </span>
            )}
            {hasPublishedVersion && hasNewerDraft && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewPublished}
                disabled={isLoadingPublished}
              >
                {isLoadingPublished ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileCheck className="h-4 w-4 mr-2" />
                )}
                Version publiée
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Éditer' : 'Aperçu'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isPending || !hasUnsavedChanges}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Sauvegarder
            </Button>
            <Button
              size="sm"
              onClick={handleTogglePublish}
              disabled={isPending}
              variant={isPublished ? 'destructive' : 'default'}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isPublished ? (
                <GlobeLock className="h-4 w-4 mr-2" />
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              {isPublished ? 'Dépublier' : 'Publier'}
            </Button>
          </div>
        </div>

        {/* Canvas */}
          <div className="max-w-4xl mx-auto p-8">
            {previewMode ? (
              <div className="space-y-6">
                {content.modules
                  .sort((a, b) => a.order - b.order)
                  .map(mod => (
                    <ModuleRenderer key={mod.id} module={mod} isEditing={false} />
                  ))}
              </div>
            ) : (
              <SortableContext
                items={content.modules.map(m => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <CanvasDropZone isEmpty={content.modules.length === 0}>
                  {content.modules.length === 0 ? (
                    <div className="min-h-[300px] border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center text-muted-foreground p-8">
                      <div className="text-center">
                        <p className="text-lg font-medium mb-2">Page vide</p>
                        <p className="text-sm">
                          Glissez des modules depuis la barre latérale ou cliquez pour les ajouter.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {content.modules
                        .sort((a, b) => a.order - b.order)
                        .map(mod => (
                          <SortableModule
                            key={mod.id}
                            module={mod}
                            isSelected={selectedModuleId === mod.id}
                            onSelect={() => setSelectedModuleId(mod.id)}
                            onDelete={() => deleteModule(mod.id)}
                            onDuplicate={() => duplicateModule(mod.id)}
                            onUpdate={(updates) => updateModule(mod.id, updates)}
                            onAddModuleToColumn={addModuleToColumn}
                            onSelectModule={setSelectedModuleId}
                            selectedModuleId={selectedModuleId}
                            onDeleteModuleFromColumn={deleteModuleFromColumn}
                            onMoveModuleInColumn={moveModuleInColumn}
                            onDuplicateModuleInColumn={duplicateModuleInColumn}
                          />
                        ))}
                    </div>
                  )}
                </CanvasDropZone>
              </SortableContext>
            )}
          </div>
        </div>

      {/* Sidebar droite - Éditeur de module */}
        <div className="w-80 border-l bg-muted/30 overflow-y-auto flex-shrink-0">
          {selectedModule ? (
            <ModuleEditor
              module={selectedModule}
              onUpdate={(updates) => updateModule(selectedModule.id, updates)}
              onClose={() => setSelectedModuleId(null)}
            />
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">
                Sélectionnez un module pour modifier ses propriétés
              </p>
            </div>
          )}
        </div>

        {/* DragOverlay pour le feedback visuel pendant le drag */}
        <DragOverlay dropAnimation={null}>
          {activeModule ? (
            <div className="opacity-90 bg-background rounded-lg shadow-2xl p-4 border-2 border-primary">
              <ModuleRenderer module={activeModule} isEditing={false} />
            </div>
          ) : activePaletteType ? (
            <PaletteDragPreview moduleType={activePaletteType} />
          ) : null}
        </DragOverlay>
      </div>

      {/* Modale - Version publiée */}
      <Dialog open={showPublishedPreview} onOpenChange={setShowPublishedPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-600" />
              Version publiée
            </DialogTitle>
            <DialogDescription>
              Aperçu de la version actuellement visible par les visiteurs
              {meta?.publishedUpdatedAt && (
                <span className="ml-2 text-xs">
                  (mise à jour le {new Date(meta.publishedUpdatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6 border rounded-lg p-6 bg-muted/20">
            {publishedContent?.modules
              ?.sort((a, b) => a.order - b.order)
              .map(mod => (
                <ModuleRenderer key={mod.id} module={mod} isEditing={false} />
              ))}
            {(!publishedContent?.modules || publishedContent.modules.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                La version publiée est vide
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DndContext>
  )
}
