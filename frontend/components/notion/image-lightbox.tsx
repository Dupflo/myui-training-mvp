"use client"

import { X, ZoomIn, ZoomOut } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"

interface LightboxProps {
  src: string
  alt: string
  onClose: () => void
}

const ImageLightbox: React.FC<LightboxProps> = ({ src, alt, onClose }) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hasMoved, setHasMoved] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Zoom level
  const zoomScale = 2

  // Reset position when zoom state changes
  useEffect(() => {
    if (!isZoomed) {
      setPosition({ x: 0, y: 0 })
    }
  }, [isZoomed])

  // Close lightbox when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "z") {
        // Toggle zoom with 'z' key
        setIsZoomed((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  const handleImageClick = (e: React.MouseEvent) => {
    // Only toggle zoom if we haven't been dragging
    if (!hasMoved) {
      if (!isZoomed) {
        // When not zoomed, clicking zooms in
        setIsZoomed(true)

        // Center zoom on click position if possible
        if (imageRef.current) {
          const rect = imageRef.current.getBoundingClientRect()
          const offsetX = (e.clientX - rect.left) / rect.width
          const offsetY = (e.clientY - rect.top) / rect.height

          // Calculate position to center the zoom on click point
          const newX = ((0.5 - offsetX) * rect.width) / 2
          const newY = ((0.5 - offsetY) * rect.height) / 2

          setPosition({ x: newX, y: newY })
        }
      } else {
        // When already zoomed, clicking zooms out
        setIsZoomed(false)
      }
    }
    e.stopPropagation()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isZoomed) {
      setIsDragging(true)
      setHasMoved(false) // Reset the moved state on mouse down
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isZoomed) {
      // Set hasMoved to true if the mouse has moved more than a few pixels
      const moveThreshold = 5 // pixels
      const deltaX = Math.abs(e.clientX - dragStart.x - position.x)
      const deltaY = Math.abs(e.clientY - dragStart.y - position.y)

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        setHasMoved(true)
      }

      // Calculate new position
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      // Get the boundaries
      const bounds = getBoundaries()

      // Apply constraints
      setPosition({
        x: Math.max(bounds.minX, Math.min(bounds.maxX, newX)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, newY)),
      })

      e.preventDefault()
      e.stopPropagation()
    }
  }

  // Function to calculate boundaries
  const getBoundaries = () => {
    if (!imageRef.current || !containerRef.current) {
      return { minX: -50, maxX: 50, minY: -50, maxY: 50 }
    }

    const imageRect = imageRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    // Calculate the maximum allowed movement in each direction
    // This is based on the size difference between the zoomed image and the container
    const zoomedWidth = imageRect.width * zoomScale
    const zoomedHeight = imageRect.height * zoomScale

    // The maximum distance the image can be moved is half the difference
    // between the zoomed size and the container size
    const maxX = Math.max(
      0,
      (zoomedWidth - containerRect.width) / (2 * zoomScale)
    )
    const maxY = Math.max(
      0,
      (zoomedHeight - containerRect.height) / (2 * zoomScale)
    )

    return {
      minX: -maxX,
      maxX: maxX,
      minY: -maxY,
      maxY: maxY,
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed && e.touches.length === 1) {
      setIsDragging(true)
      setHasMoved(false) // Reset the moved state on touch start
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      })
      e.stopPropagation()
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && isZoomed && e.touches.length === 1) {
      // Set hasMoved to true if the touch has moved more than a few pixels
      const moveThreshold = 5 // pixels
      const deltaX = Math.abs(e.touches[0].clientX - dragStart.x - position.x)
      const deltaY = Math.abs(e.touches[0].clientY - dragStart.y - position.y)

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        setHasMoved(true)
      }

      // Calculate new position
      const newX = e.touches[0].clientX - dragStart.x
      const newY = e.touches[0].clientY - dragStart.y

      // Get the boundaries
      const bounds = getBoundaries()

      // Apply constraints
      setPosition({
        x: Math.max(bounds.minX, Math.min(bounds.maxX, newX)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, newY)),
      })

      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false)
    // If we haven't moved significantly, treat it as a tap
    if (!hasMoved && isZoomed) {
      setIsZoomed(false)
    }
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          aria-label="Close lightbox"
        >
          <X size={24} />
        </button>

        <button
          className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 focus:outline-none"
          onClick={(e) => {
            setIsZoomed(!isZoomed)
            e.stopPropagation()
          }}
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>

        <div
          ref={containerRef}
          className="overflow-hidden"
          style={{
            cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          }}
        >
          <div className="relative">
            <img
              ref={imageRef}
              src={src || "/placeholder.svg"}
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain transition-transform"
              style={{
                transform: isZoomed
                  ? `scale(${zoomScale}) translate(${position.x}px, ${position.y}px)`
                  : "scale(1)",
                transformOrigin: "center",
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              onClick={handleImageClick}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              draggable={false}
            />
          </div>
        </div>

        {alt && <div className="mt-2 text-center text-white">{alt}</div>}

        <div className="absolute bottom-2 left-0 right-0 text-center text-white text-sm opacity-70">
          {isZoomed ? "Click to zoom out or drag to pan" : "Click to zoom in"}
        </div>
      </div>
    </div>
  )
}

export default ImageLightbox
