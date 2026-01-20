// ============================================
// Types pour le Page Builder modulaire
// ============================================

// Types de modules disponibles
export type ModuleType = 
  | 'title'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'spacer'
  | 'divider'
  | 'columns'
  | 'video'
  | 'callout'
  | 'list'

// Tailles de colonnes disponibles
export type ColumnWidth = '1/4' | '1/3' | '1/2' | '2/3' | '3/4' | 'full'

// Alignement du texte
export type TextAlign = 'left' | 'center' | 'right'

// Alignement vertical
export type VerticalAlign = 'start' | 'center' | 'end'

// Variantes de bouton
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'

// Tailles de bouton
export type ButtonSize = 'sm' | 'md' | 'lg'

// Niveaux de titre
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

// ============================================
// Modules de base
// ============================================

export interface BaseModule {
  id: string
  type: ModuleType
  order: number
}

// Module Titre
export interface TitleModule extends BaseModule {
  type: 'title'
  content: string
  level: HeadingLevel
  align?: TextAlign
  color?: string
}

// Module Paragraphe
export interface ParagraphModule extends BaseModule {
  type: 'paragraph'
  content: string
  align?: TextAlign
  fontSize?: 'sm' | 'base' | 'lg' | 'xl'
}

// Module Bouton
export interface ButtonModule extends BaseModule {
  type: 'button'
  text: string
  href?: string
  variant?: ButtonVariant
  size?: ButtonSize
  align?: TextAlign
  fullWidth?: boolean
}

// Module Image
export interface ImageModule extends BaseModule {
  type: 'image'
  src: string
  alt: string
  caption?: string
  width?: 'sm' | 'md' | 'lg' | 'full'
  rounded?: boolean
}

// Module Video
export interface VideoModule extends BaseModule {
  type: 'video'
  src: string
  provider?: 'youtube' | 'vimeo' | 'custom'
  caption?: string
}

// Module Espaceur
export interface SpacerModule extends BaseModule {
  type: 'spacer'
  height: 'sm' | 'md' | 'lg' | 'xl'
}

// Module Séparateur
export interface DividerModule extends BaseModule {
  type: 'divider'
  style?: 'solid' | 'dashed' | 'dotted'
}

// Module Callout (mise en avant)
export interface CalloutModule extends BaseModule {
  type: 'callout'
  content: string
  icon?: string
  variant?: 'info' | 'warning' | 'success' | 'error'
}

// Module Liste
export interface ListModule extends BaseModule {
  type: 'list'
  items: string[]
  style?: 'bullet' | 'number' | 'check'
}

// Module Colonnes
export interface ColumnItem {
  width: ColumnWidth
  modules: ContentModule[]
}

export interface ColumnsModule extends BaseModule {
  type: 'columns'
  columns: ColumnItem[]
  gap?: 'sm' | 'md' | 'lg'
  verticalAlign?: VerticalAlign
}

// Union de tous les modules
export type ContentModule = 
  | TitleModule
  | ParagraphModule
  | ButtonModule
  | ImageModule
  | VideoModule
  | SpacerModule
  | DividerModule
  | CalloutModule
  | ListModule
  | ColumnsModule

// ============================================
// Structure du contenu de la page
// ============================================

export interface PageContent {
  modules: ContentModule[]
  version?: number
  updatedAt?: string
}

// ============================================
// Types pour l'API
// ============================================

export interface LandingPageMeta {
  hasPublishedVersion: boolean
  hasNewerDraft: boolean
  publishedAt: string | null
  publishedUpdatedAt: string | null
}

export interface LandingPage {
  id: number
  documentId: string
  title: string
  slug: string
  description?: string
  content: PageContent | null
  coverImage?: {
    url: string
    alternativeText?: string
  }
  seoTitle?: string
  seoDescription?: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  program?: {
    id: number
    documentId: string
    title: string
  }
  creator?: {
    id: number
    email: string
  }
  _meta?: LandingPageMeta
}

export interface Program {
  id: number
  documentId: string
  title: string
  description?: string
  price?: number
  image?: {
    url: string
    alternativeText?: string
  }
  landing_pages?: LandingPage[]
  creator?: {
    id: number
    email: string
  }
  createdAt: string
  updatedAt: string
}

// ============================================
// Types pour le Builder (drag & drop)
// ============================================

export interface DragItem {
  type: ModuleType
  index: number
  id: string
}

export interface ModuleTemplate {
  type: ModuleType
  label: string
  icon: string
  defaultProps: Partial<ContentModule>
}

// Templates de modules par défaut
export const MODULE_TEMPLATES: ModuleTemplate[] = [
  {
    type: 'title',
    label: 'Titre',
    icon: 'Type',
    defaultProps: { content: 'Nouveau titre', level: 'h2', align: 'left' }
  },
  {
    type: 'paragraph',
    label: 'Paragraphe',
    icon: 'AlignLeft',
    defaultProps: { content: 'Votre texte ici...', align: 'left', fontSize: 'base' }
  },
  {
    type: 'button',
    label: 'Bouton',
    icon: 'MousePointer',
    defaultProps: { text: 'Cliquez ici', variant: 'primary', size: 'md' }
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'Image',
    defaultProps: { src: '', alt: 'Image', width: 'full', rounded: true }
  },
  {
    type: 'video',
    label: 'Vidéo',
    icon: 'Video',
    defaultProps: { src: '', provider: 'youtube' }
  },
  {
    type: 'spacer',
    label: 'Espaceur',
    icon: 'MoveVertical',
    defaultProps: { height: 'md' }
  },
  {
    type: 'divider',
    label: 'Séparateur',
    icon: 'Minus',
    defaultProps: { style: 'solid' }
  },
  {
    type: 'callout',
    label: 'Callout',
    icon: 'AlertCircle',
    defaultProps: { content: 'Information importante', variant: 'info', icon: '💡' }
  },
  {
    type: 'list',
    label: 'Liste',
    icon: 'List',
    defaultProps: { items: ['Élément 1', 'Élément 2', 'Élément 3'], style: 'bullet' }
  },
  {
    type: 'columns',
    label: 'Colonnes',
    icon: 'Columns',
    defaultProps: { 
      columns: [
        { width: '1/2', modules: [] },
        { width: '1/2', modules: [] }
      ],
      gap: 'md',
      verticalAlign: 'start'
    }
  }
]

// ============================================
// Exemple de contenu JSON pour une landing page
// ============================================

export const EXAMPLE_PAGE_CONTENT: PageContent = {
  modules: [
    {
      id: 'title-1',
      type: 'title',
      order: 0,
      content: 'Transformez votre carrière avec notre formation',
      level: 'h1',
      align: 'center'
    },
    {
      id: 'spacer-1',
      type: 'spacer',
      order: 1,
      height: 'md'
    },
    {
      id: 'paragraph-1',
      type: 'paragraph',
      order: 2,
      content: 'Découvrez une méthode éprouvée pour développer vos compétences et atteindre vos objectifs professionnels.',
      align: 'center',
      fontSize: 'lg'
    },
    {
      id: 'button-1',
      type: 'button',
      order: 3,
      text: 'Commencer maintenant',
      href: '/checkout',
      variant: 'primary',
      size: 'lg',
      align: 'center'
    },
    {
      id: 'divider-1',
      type: 'divider',
      order: 4,
      style: 'solid'
    },
    {
      id: 'columns-1',
      type: 'columns',
      order: 5,
      gap: 'lg',
      columns: [
        {
          width: '1/3',
          modules: [
            {
              id: 'col1-title',
              type: 'title',
              order: 0,
              content: '🎯 Objectifs clairs',
              level: 'h3',
              align: 'center'
            },
            {
              id: 'col1-text',
              type: 'paragraph',
              order: 1,
              content: 'Des objectifs pédagogiques précis pour mesurer votre progression.',
              align: 'center'
            }
          ]
        },
        {
          width: '1/3',
          modules: [
            {
              id: 'col2-title',
              type: 'title',
              order: 0,
              content: '📚 Contenu riche',
              level: 'h3',
              align: 'center'
            },
            {
              id: 'col2-text',
              type: 'paragraph',
              order: 1,
              content: 'Des ressources variées : vidéos, exercices, études de cas.',
              align: 'center'
            }
          ]
        },
        {
          width: '1/3',
          modules: [
            {
              id: 'col3-title',
              type: 'title',
              order: 0,
              content: '🏆 Certification',
              level: 'h3',
              align: 'center'
            },
            {
              id: 'col3-text',
              type: 'paragraph',
              order: 1,
              content: 'Une certification reconnue à la fin de votre parcours.',
              align: 'center'
            }
          ]
        }
      ]
    },
    {
      id: 'callout-1',
      type: 'callout',
      order: 6,
      content: 'Offre spéciale : -20% avec le code PROMO20 jusqu\'au 31 janvier !',
      icon: '🎉',
      variant: 'success'
    },
    {
      id: 'image-1',
      type: 'image',
      order: 7,
      src: '/images/formation-preview.jpg',
      alt: 'Aperçu de la formation',
      caption: 'Interface de notre plateforme de formation',
      width: 'lg',
      rounded: true
    }
  ],
  version: 1
}

// ============================================
// Helpers
// ============================================

export function generateModuleId(type: ModuleType): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function createModule<T extends ContentModule>(
  type: T['type'],
  props: Omit<T, 'id' | 'type' | 'order'>,
  order: number
): T {
  return {
    id: generateModuleId(type),
    type,
    order,
    ...props
  } as T
}

export function reorderModules(modules: ContentModule[]): ContentModule[] {
  return modules.map((module, index) => ({
    ...module,
    order: index
  }))
}

export function getColumnWidthClass(width: ColumnWidth): string {
  const widthMap: Record<ColumnWidth, string> = {
    '1/4': 'w-full md:w-1/4',
    '1/3': 'w-full md:w-1/3',
    '1/2': 'w-full md:w-1/2',
    '2/3': 'w-full md:w-2/3',
    '3/4': 'w-full md:w-3/4',
    'full': 'w-full'
  }
  return widthMap[width]
}
