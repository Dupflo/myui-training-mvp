"use client"

import type React from "react"

interface CustomButtonProps {
  text: string
  link?: string
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  width?: "auto" | "full"
  color?: string
  onClick?: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  link,
  variant = "primary",
  size = "md",
  width = "auto",
  color,
  onClick,
}) => {
  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"

  // Width classes
  const widthClasses = {
    auto: "w-auto",
    full: "w-full",
  }

  // Size classes
  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-lg",
  }

  // Variant classes
  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500",
  }

  // Apply custom color if provided
  let style = {}
  if (color && variant === "primary") {
    style = {
      backgroundColor: color,
      color: "#ffffff",
    }
  } else if (color && variant === "outline") {
    style = {
      borderColor: color,
      color: color,
    }
  } else if (color) {
    style = { color: color }
  }

  const className = `my-4 ${baseClasses} ${sizeClasses[size]} ${widthClasses[width]} ${variantClasses[variant]}`

  if (link) {
    return (
      <a
        href={link}
        className={className}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    )
  }

  return (
    <button className={className} style={style} onClick={onClick}>
      {text}
    </button>
  )
}

export default CustomButton
