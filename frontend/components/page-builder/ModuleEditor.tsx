'use client'

import { ContentModule, TextAlign, HeadingLevel, ButtonVariant, ButtonSize, ColumnWidth, ColumnsModule as ColumnsModuleType, VerticalAlign } from '@/lib/types/page-builder'
import { AlignStartVertical, AlignCenterVertical, AlignEndVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ModuleEditorProps {
  module: ContentModule
  onUpdate: (updates: Partial<ContentModule>) => void
  onClose: () => void
}

export function ModuleEditor({ module, onUpdate, onClose }: ModuleEditorProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Propriétés
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Éditeur selon le type de module */}
        {module.type === 'title' && (
          <TitleEditor module={module} onUpdate={onUpdate} />
        )}
        {module.type === 'paragraph' && (
          <ParagraphEditor module={module} onUpdate={onUpdate} />
        )}
        {module.type === 'button' && (
          <ButtonEditor module={module} onUpdate={onUpdate} />
        )}
        {module.type === 'image' && (
          <ImageEditor module={module} onUpdate={onUpdate} />
        )}
        {module.type === 'video' && (
          <VideoEditor module={module} onUpdate={onUpdate} />
        )}
        {module.type === 'spacer' && (
          <SpacerEditor module={module} onUpdate={onUpdate} />
        )}
        {module.type === 'divider' && (
          <DividerEditor module={module} onUpdate={onUpdate} />
        )}
        {module.type === 'callout' && (
          <CalloutEditor module={module} onUpdate={onUpdate} />
        )}
        {module.type === 'list' && (
          <ListEditor module={module} onUpdate={onUpdate} />
        )}
        {module.type === 'columns' && (
          <ColumnsEditor module={module} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  )
}

// ============================================
// Éditeurs spécifiques par type de module
// ============================================

function TitleEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'title') return null

  return (
    <>
      <div className="space-y-2">
        <Label>Texte</Label>
        <Input
          value={module.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Niveau</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={module.level}
          onChange={(e) => onUpdate({ level: e.target.value as HeadingLevel })}
        >
          <option value="h1">H1 - Très grand</option>
          <option value="h2">H2 - Grand</option>
          <option value="h3">H3 - Moyen</option>
          <option value="h4">H4 - Petit</option>
        </select>
      </div>

      <AlignmentPicker value={module.align || 'left'} onChange={(align) => onUpdate({ align })} />

      <div className="space-y-2">
        <Label>Couleur (optionnel)</Label>
        <Input
          type="color"
          value={module.color || '#000000'}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="h-10 p-1"
        />
      </div>
    </>
  )
}

function ParagraphEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'paragraph') return null

  return (
    <>
      <div className="space-y-2">
        <Label>Texte</Label>
        <textarea
          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background resize-y"
          value={module.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Taille du texte</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={module.fontSize || 'base'}
          onChange={(e) => onUpdate({ fontSize: e.target.value as 'sm' | 'base' | 'lg' | 'xl' })}
        >
          <option value="sm">Petit</option>
          <option value="base">Normal</option>
          <option value="lg">Grand</option>
          <option value="xl">Très grand</option>
        </select>
      </div>

      <AlignmentPicker value={module.align || 'left'} onChange={(align) => onUpdate({ align })} />
    </>
  )
}

function ButtonEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'button') return null

  return (
    <>
      <div className="space-y-2">
        <Label>Texte</Label>
        <Input
          value={module.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Lien (URL)</Label>
        <Input
          value={module.href || ''}
          onChange={(e) => onUpdate({ href: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>Style</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={module.variant || 'primary'}
          onChange={(e) => onUpdate({ variant: e.target.value as ButtonVariant })}
        >
          <option value="primary">Primaire</option>
          <option value="secondary">Secondaire</option>
          <option value="outline">Contour</option>
          <option value="ghost">Transparent</option>
          <option value="destructive">Destructif</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Taille</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={module.size || 'md'}
          onChange={(e) => onUpdate({ size: e.target.value as ButtonSize })}
        >
          <option value="sm">Petit</option>
          <option value="md">Moyen</option>
          <option value="lg">Grand</option>
        </select>
      </div>

      <AlignmentPicker value={module.align || 'left'} onChange={(align) => onUpdate({ align })} />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="fullWidth"
          checked={module.fullWidth || false}
          onChange={(e) => onUpdate({ fullWidth: e.target.checked })}
          className="rounded border-input"
        />
        <Label htmlFor="fullWidth">Pleine largeur</Label>
      </div>
    </>
  )
}

function ImageEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'image') return null

  return (
    <>
      <div className="space-y-2">
        <Label>URL de l'image</Label>
        <Input
          value={module.src}
          onChange={(e) => onUpdate({ src: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>Texte alternatif</Label>
        <Input
          value={module.alt}
          onChange={(e) => onUpdate({ alt: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Légende (optionnel)</Label>
        <Input
          value={module.caption || ''}
          onChange={(e) => onUpdate({ caption: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Largeur</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={module.width || 'full'}
          onChange={(e) => onUpdate({ width: e.target.value as 'sm' | 'md' | 'lg' | 'full' })}
        >
          <option value="sm">Petite</option>
          <option value="md">Moyenne</option>
          <option value="lg">Grande</option>
          <option value="full">Pleine largeur</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="rounded"
          checked={module.rounded ?? true}
          onChange={(e) => onUpdate({ rounded: e.target.checked })}
          className="rounded border-input"
        />
        <Label htmlFor="rounded">Coins arrondis</Label>
      </div>
    </>
  )
}

function VideoEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'video') return null

  return (
    <>
      <div className="space-y-2">
        <Label>URL de la vidéo</Label>
        <Input
          value={module.src}
          onChange={(e) => onUpdate({ src: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div className="space-y-2">
        <Label>Plateforme</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={module.provider || 'youtube'}
          onChange={(e) => onUpdate({ provider: e.target.value as 'youtube' | 'vimeo' | 'custom' })}
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="custom">Autre</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Légende (optionnel)</Label>
        <Input
          value={module.caption || ''}
          onChange={(e) => onUpdate({ caption: e.target.value })}
        />
      </div>
    </>
  )
}

function SpacerEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'spacer') return null

  return (
    <div className="space-y-2">
      <Label>Hauteur</Label>
      <select
        className="w-full h-10 px-3 rounded-md border border-input bg-background"
        value={module.height || 'md'}
        onChange={(e) => onUpdate({ height: e.target.value as 'sm' | 'md' | 'lg' | 'xl' })}
      >
        <option value="sm">Petit (1rem)</option>
        <option value="md">Moyen (2rem)</option>
        <option value="lg">Grand (4rem)</option>
        <option value="xl">Très grand (6rem)</option>
      </select>
    </div>
  )
}

function DividerEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'divider') return null

  return (
    <div className="space-y-2">
      <Label>Style</Label>
      <select
        className="w-full h-10 px-3 rounded-md border border-input bg-background"
        value={module.style || 'solid'}
        onChange={(e) => onUpdate({ style: e.target.value as 'solid' | 'dashed' | 'dotted' })}
      >
        <option value="solid">Solide</option>
        <option value="dashed">Tirets</option>
        <option value="dotted">Points</option>
      </select>
    </div>
  )
}

function CalloutEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'callout') return null

  return (
    <>
      <div className="space-y-2">
        <Label>Contenu</Label>
        <textarea
          className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background resize-y"
          value={module.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Icône (emoji)</Label>
        <Input
          value={module.icon || '💡'}
          onChange={(e) => onUpdate({ icon: e.target.value })}
          maxLength={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={module.variant || 'info'}
          onChange={(e) => onUpdate({ variant: e.target.value as 'info' | 'warning' | 'success' | 'error' })}
        >
          <option value="info">Information</option>
          <option value="warning">Avertissement</option>
          <option value="success">Succès</option>
          <option value="error">Erreur</option>
        </select>
      </div>
    </>
  )
}

function ListEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'list') return null

  return (
    <>
      <div className="space-y-2">
        <Label>Éléments (un par ligne)</Label>
        <textarea
          className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background resize-y font-mono text-sm"
          value={module.items.join('\n')}
          onChange={(e) => onUpdate({ items: e.target.value.split('\n').filter(Boolean) })}
        />
      </div>

      <div className="space-y-2">
        <Label>Style</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={module.style || 'bullet'}
          onChange={(e) => onUpdate({ style: e.target.value as 'bullet' | 'number' | 'check' })}
        >
          <option value="bullet">Puces</option>
          <option value="number">Numéros</option>
          <option value="check">Coches</option>
        </select>
      </div>
    </>
  )
}

function ColumnsEditor({ module, onUpdate }: { module: ContentModule; onUpdate: (u: Partial<ContentModule>) => void }) {
  if (module.type !== 'columns') return null

  const columnsModule = module as ColumnsModuleType

  // Préréglages de colonnes
  const presets = [
    { label: '2 colonnes égales', columns: [{ width: '1/2' as ColumnWidth }, { width: '1/2' as ColumnWidth }] },
    { label: '3 colonnes égales', columns: [{ width: '1/3' as ColumnWidth }, { width: '1/3' as ColumnWidth }, { width: '1/3' as ColumnWidth }] },
    { label: '4 colonnes égales', columns: [{ width: '1/4' as ColumnWidth }, { width: '1/4' as ColumnWidth }, { width: '1/4' as ColumnWidth }, { width: '1/4' as ColumnWidth }] },
    { label: '1/3 + 2/3', columns: [{ width: '1/3' as ColumnWidth }, { width: '2/3' as ColumnWidth }] },
    { label: '2/3 + 1/3', columns: [{ width: '2/3' as ColumnWidth }, { width: '1/3' as ColumnWidth }] },
    { label: '1/4 + 3/4', columns: [{ width: '1/4' as ColumnWidth }, { width: '3/4' as ColumnWidth }] },
    { label: '3/4 + 1/4', columns: [{ width: '3/4' as ColumnWidth }, { width: '1/4' as ColumnWidth }] },
  ]

  const handlePresetChange = (preset: typeof presets[0]) => {
    // Préserver les modules existants dans les colonnes si possible
    const newColumns = preset.columns.map((col, index) => ({
      width: col.width,
      modules: columnsModule.columns[index]?.modules || []
    }))
    onUpdate({ columns: newColumns })
  }

  const handleColumnWidthChange = (index: number, width: ColumnWidth) => {
    const newColumns = columnsModule.columns.map((col, i) => 
      i === index ? { ...col, width } : col
    )
    onUpdate({ columns: newColumns })
  }

  const addColumn = () => {
    const newColumns = [...columnsModule.columns, { width: '1/2' as ColumnWidth, modules: [] }]
    onUpdate({ columns: newColumns })
  }

  const removeColumn = (index: number) => {
    if (columnsModule.columns.length <= 2) return
    const newColumns = columnsModule.columns.filter((_, i) => i !== index)
    onUpdate({ columns: newColumns })
  }

  return (
    <>
      <div className="space-y-2">
        <Label>Préréglages</Label>
        <div className="grid grid-cols-1 gap-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              className="w-full py-2 px-3 text-left text-sm rounded-md border border-input hover:bg-accent transition-colors"
              onClick={() => handlePresetChange(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Colonnes ({columnsModule.columns.length})</Label>
        <div className="space-y-2">
          {columnsModule.columns.map((column, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                className="flex-1 h-9 px-2 rounded-md border border-input bg-background text-sm"
                value={column.width}
                onChange={(e) => handleColumnWidthChange(index, e.target.value as ColumnWidth)}
              >
                <option value="1/4">1/4 (25%)</option>
                <option value="1/3">1/3 (33%)</option>
                <option value="1/2">1/2 (50%)</option>
                <option value="2/3">2/3 (66%)</option>
                <option value="3/4">3/4 (75%)</option>
                <option value="full">Pleine</option>
              </select>
              {columnsModule.columns.length > 2 && (
                <button
                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                  onClick={() => removeColumn(index)}
                  title="Supprimer cette colonne"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={addColumn}
        >
          + Ajouter une colonne
        </Button>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Espacement</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={columnsModule.gap || 'md'}
          onChange={(e) => onUpdate({ gap: e.target.value as 'sm' | 'md' | 'lg' })}
        >
          <option value="sm">Petit</option>
          <option value="md">Moyen</option>
          <option value="lg">Grand</option>
        </select>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Alignement vertical</Label>
        <div className="flex gap-1">
          {([
            { value: 'start', label: 'Haut', icon: AlignStartVertical },
            { value: 'center', label: 'Centre', icon: AlignCenterVertical },
            { value: 'end', label: 'Bas', icon: AlignEndVertical }
          ] as const).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              className={cn(
                'flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors flex items-center justify-center gap-2',
                (columnsModule.verticalAlign || 'start') === value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-input hover:bg-accent'
              )}
              onClick={() => onUpdate({ verticalAlign: value as VerticalAlign })}
              title={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          💡 Les modules dans chaque colonne seront conservés lors du changement de structure.
        </p>
      </div>
    </>
  )
}

// ============================================
// Composants partagés
// ============================================

function AlignmentPicker({ value, onChange }: { value: TextAlign; onChange: (v: TextAlign) => void }) {
  return (
    <div className="space-y-2">
      <Label>Alignement</Label>
      <div className="flex gap-1">
        {(['left', 'center', 'right'] as const).map((align) => (
          <button
            key={align}
            className={cn(
              'flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors',
              value === align
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-input hover:bg-accent'
            )}
            onClick={() => onChange(align)}
          >
            {align === 'left' && 'Gauche'}
            {align === 'center' && 'Centre'}
            {align === 'right' && 'Droite'}
          </button>
        ))}
      </div>
    </div>
  )
}
