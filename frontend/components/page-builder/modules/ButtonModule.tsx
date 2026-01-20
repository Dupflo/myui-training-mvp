'use client'

import { ButtonModule as ButtonModuleType, ButtonVariant, ButtonSize, TextAlign } from '@/lib/types/page-builder'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ButtonModuleProps {
  module: ButtonModuleType
  isEditing?: boolean
  onUpdate?: (updates: Partial<ButtonModuleType>) => void
}

const alignClasses: Record<TextAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end'
}

const variantMap: Record<ButtonVariant, 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'> = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  destructive: 'destructive'
}

const sizeMap: Record<ButtonSize, 'sm' | 'default' | 'lg'> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg'
}

export function ButtonModule({ module, isEditing, onUpdate }: ButtonModuleProps) {
  const { text, href, variant = 'primary', size = 'md', align = 'left', fullWidth } = module

  const buttonElement = (
    <Button
      variant={variantMap[variant]}
      size={sizeMap[size]}
      className={cn(fullWidth && 'w-full')}
      onClick={(e) => {
        if (isEditing) {
          e.preventDefault()
        }
      }}
    >
      {isEditing ? (
        <span
          contentEditable
          suppressContentEditableWarning
          className="outline-none"
          onBlur={(e) => onUpdate?.({ text: e.currentTarget.textContent || '' })}
        >
          {text}
        </span>
      ) : (
        text
      )}
    </Button>
  )

  const content = href && !isEditing ? (
    <Link href={href}>
      {buttonElement}
    </Link>
  ) : (
    buttonElement
  )

  return (
    <div className={cn('flex', alignClasses[align])}>
      {content}
    </div>
  )
}
